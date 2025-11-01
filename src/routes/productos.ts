import { Router, Request, Response } from 'express';
import { enviar_error_con_status } from './interfaces';
import pool from '../config/db';
import { executeQuery } from '../services/queryExecutor';
import { HttpError } from '../utils/http-error';
import { requireAuthAPI } from '../middlewares/middlewares-auth';

const router = Router();

// PREGUNTAR SOBRE ESTO
router.get("/productos/:id", async (req: Request, res: Response) => {
    const table_name = `terox.productos`;
    const producto_id = req.params['id'];

    try {
        const items = await pool.query(`SELECT * FROM ${table_name} WHERE producto_id = $1`, [producto_id]);
        return res.json(items.rows);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error al obtener de ${table_name}:`, error.message);
        } else {
            console.error(`Error desconocido al obtener de ${table_name}:`, error);
        }
        return enviar_error_con_status(res, 400, "Error al obtener los datos");
    }
});

router.get("/productos-de-usuario", requireAuthAPI, async (req: Request, res: Response) => {
    const table_name = `terox.productos`;
    const usuario_id = req.session.usuario?.usuario_id;

    try {
        const items = await pool.query(`SELECT * FROM ${table_name} WHERE usuario_id = $1`, [usuario_id]);
        return res.json(items.rows);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error al obtener de ${table_name}:`, error.message);
        } else {
            console.error(`Error desconocido al obtener de ${table_name}:`, error);
        }
        return enviar_error_con_status(res, 400, "Error al obtener los datos");
    }
});


router.put('/comprar/:id', requireAuthAPI, async (req: Request, res: Response) => {
    const producto_id = req.params['id'];
    const cantidad_a_comprar: number = req.body.cantidad;

    const selectQuery = `SELECT stock FROM terox.productos WHERE producto_id = $1`;
    const error_para_cliente = 'Error al intentar comprar el producto';
    const result = await executeQuery(
        selectQuery,
        [producto_id],
        error_para_cliente
    );

    const stock = result.rows[0]?.stock;

    if (stock < cantidad_a_comprar) {
        throw new HttpError(400, 'Stock insuficiente para completar la compra');
    }

    const updateQuery = `
    UPDATE terox.productos
    SET stock = stock - $1
    WHERE producto_id = $2
    RETURNING stock
  `;
    const updateResult = await executeQuery(
        updateQuery,
        [cantidad_a_comprar, producto_id],
        error_para_cliente
    );

    const nuevoStock = updateResult.rows[0]?.stock;

    return res.status(200).json({
        mensaje: 'Compra realizada con éxito',
        stock_restante: nuevoStock
    });
});

export default router;
