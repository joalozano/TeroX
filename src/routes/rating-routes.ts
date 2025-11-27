import { Router } from "express";
import { executeQuery } from "../services/queryExecutor";
import { requireAuthAPI } from "../middlewares/middlewares-auth";
import { HttpError } from "../types/http-error";
import pool from "../config/db";

const router = Router();

router.put("/rating/:orden_id", requireAuthAPI, async (req, res, next) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const orden_id = Number(req.params['orden_id']);
        const usuario = req.session.usuario?.username;
        const rating_nuevo = Number(req.body.rating);

        if (isNaN(orden_id)) throw new HttpError(400, "orden_id inválido");
        if (![1, 2, 3, 4, 5].includes(rating_nuevo))
            throw new HttpError(400, "El rating debe ser entre 1 y 5");

        const queryOrden = `
            SELECT *
            FROM terox.ordenes
            WHERE orden_id = $1
            FOR UPDATE
        `;
        const ord = (await executeQuery(queryOrden, [orden_id], undefined, client)).rows[0];
        if (!ord) throw new HttpError(404, "Orden no encontrada");
        if (ord.comprador_username !== usuario)
            throw new HttpError(403, "No autorizado para calificar esta orden");
        if (ord.estado_de_entrega !== "entregado_al_comprador")
            throw new HttpError(400, "Solo se puede calificar una orden entregada");

        const rating_viejo_orden = ord.rating;

        const queryProducto = `
            SELECT producto_id, rating, cantidad_rating
            FROM terox.productos
            WHERE producto_id = $1
            FOR UPDATE
        `;
        const prod = (await executeQuery(queryProducto, [ord.producto_id], undefined, client)).rows[0];
        if (!prod) throw new HttpError(500, "Producto no encontrado");

        let { rating: rating_prod, cantidad_rating: cant_prod } = prod;

        let nueva_cantidad_rating = cant_prod;
        let nuevo_rating_producto = 0;

        if (rating_viejo_orden === 0) {
            nueva_cantidad_rating = cant_prod + 1;
            nuevo_rating_producto =
                (rating_prod * cant_prod + rating_nuevo) / nueva_cantidad_rating;
        } else {
            nuevo_rating_producto =
                (rating_prod * cant_prod - rating_viejo_orden + rating_nuevo) / cant_prod;
        }

        nuevo_rating_producto = Number(nuevo_rating_producto.toFixed(2));

        const queryUpdateProducto = `
            UPDATE terox.productos
            SET rating = $1, cantidad_rating = $2
            WHERE producto_id = $3
        `;
        await executeQuery(queryUpdateProducto, [
            nuevo_rating_producto,
            nueva_cantidad_rating,
            ord.producto_id
        ], undefined, client);

        const queryUpdateOrden = `
            UPDATE terox.ordenes
            SET rating = $1
            WHERE orden_id = $2
        `;
        await executeQuery(queryUpdateOrden, [rating_nuevo, orden_id], undefined, client);

        await client.query("COMMIT");

        res.json({
            success: true,
            rating_producto: nuevo_rating_producto,
            cantidad_rating: nueva_cantidad_rating,
            rating_orden: rating_nuevo
        });

    } catch (err) {
        await client.query("ROLLBACK");
        next(err);
    } finally {
        client.release();
    }
});

export default router;
