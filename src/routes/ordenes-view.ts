import { Router } from "express";
import { requireAuth } from "../middlewares/middlewares-auth";
import { executeQuery } from "../services/queryExecutor";
import { HttpError } from "../types/http-error";

const router = Router();

router.get("/mis-ordenes", requireAuth, async (_, res) => {
    return res.render('ordenes');
});

router.get("/ordenes-detalle/comprador/:orden_id", requireAuth, async (req, res) => {
    const ordenId = Number(req.params['orden_id']);
    const username = req.session.usuario?.username;

    if (!username) throw new HttpError(401, "No autenticado");
    if (Number.isNaN(ordenId)) throw new HttpError(400, "orden_id inválido");

    const ordenRes = await executeQuery(
        `SELECT * FROM terox.ordenes o WHERE o.orden_id = $1`,
        [ordenId]
    );
    const orden = ordenRes.rows[0];
    if (!orden) throw new HttpError(404, "Orden no encontrada");
    if (orden.comprador_username !== username) throw new HttpError(403, "No autorizado");

    const facturaRes = await executeQuery(
        `SELECT *
			 FROM terox.facturas
			 WHERE orden_id = $1 LIMIT 1`,
        [ordenId]
    );
    const factura = facturaRes.rows[0] ?? null;

    const identRes = await executeQuery(
        `SELECT username, cuil, nombre_completo, domicilio_fiscal
			 FROM terox.identidad_fiscal
			 WHERE username IN ($1, $2)`,
        [orden.comprador_username, orden.vendedor_username]
    );
    const identMap = Object.fromEntries(identRes.rows.map(r => [r.username, r]));

    const pagosRes = await executeQuery(
        `SELECT *
			 FROM terox.pagos
			 WHERE cuil = $1 ORDER BY pago_id DESC LIMIT 20`,
        [identMap[orden.comprador_username].cuil]
    );

    res.render('factura-comprador', {
        orden,
        producto: orden.producto_nombre,
        factura,
        pagos: pagosRes.rows
    });
});

router.get("/ordenes-detalle/vendedor/:orden_id", requireAuth, async (req, res) => {
    const ordenId = Number(req.params['orden_id']);
    const username = req.session.usuario?.username;

    if (Number.isNaN(ordenId)) throw new HttpError(400, "orden_id inválido");

    const ordenRes = await executeQuery(
        `SELECT * FROM terox.ordenes o WHERE o.orden_id = $1`,
        [ordenId]
    );

    const orden = ordenRes.rows[0];
    if (!orden) throw new HttpError(404, "Orden no encontrada");
    if (orden.vendedor_username !== username) throw new HttpError(403, "No autorizado");

    const facturaRes = await executeQuery(
        `SELECT *
			 FROM terox.facturas
			 WHERE orden_id = $1 LIMIT 1`,
        [ordenId]
    );
    const factura = facturaRes.rows[0] ?? null;

    const identRes = await executeQuery(
        `SELECT username, cuil, nombre_completo, domicilio_fiscal
			 FROM terox.identidad_fiscal
			 WHERE username IN ($1, $2)`,
        [orden.comprador_username, orden.vendedor_username]
    );
    const identMap = Object.fromEntries(identRes.rows.map(r => [r.username, r]));

    const pagosRes = await executeQuery(
        `SELECT *
			 FROM terox.pagos
			 WHERE cuil = $1 ORDER BY pago_id DESC LIMIT 20`,
        [identMap[orden.vendedor_username].cuil]
    );

    res.render('factura-vendedor', {
        orden,
        producto: orden.producto_nombre,
        factura,
        pagos: pagosRes.rows
    });
});

export default router;
