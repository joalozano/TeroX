import { Router, Request, Response } from 'express';
import { executeQuery } from '../services/queryExecutor';
import { HttpError } from '../types/http-error';
import { requireAuthAPI } from '../middlewares/middlewares-auth';
import pool from '../config/db';
import { FiltroSimple, QueryFilter } from '../types/queryfilters';
import { añadirFiltrosPermitidosAQuery } from '../utils/query-utils';

const router = Router();

export const query_obtenerProducto = `
    SELECT username AS vendedor_username, nombre AS producto_nombre, precio, stock
    FROM terox.productos
    WHERE producto_id = $1
`;

export const query_descontarStock = `
    UPDATE terox.productos
    SET stock = stock - $1
    WHERE producto_id = $2
`;

export const query_devolverStock = `
    UPDATE terox.productos
    SET stock = stock + $1
    WHERE producto_id = $2
`;

export const query_crearOrden = `
    INSERT INTO terox.ordenes (
        producto_id, comprador_username, vendedor_username,
        direccion_entrega, cantidad_pedida, precio_unitario,
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING orden_id
`;

export const query_obtenerIdentidades = `
    SELECT 
        c.cuil AS comprador_cuil,
        c.nombre_completo AS comprador_nombre,
        c.domicilio_fiscal AS comprador_domicilio,
        v.cuil AS vendedor_cuil,
        v.nombre_completo AS vendedor_nombre,
        v.domicilio_fiscal AS vendedor_domicilio
    FROM terox.identidad_fiscal AS c, terox.identidad_fiscal AS v
    WHERE c.username = $1 AND v.username = $2
`;

export const query_crearFactura = `
    INSERT INTO terox.facturas (
        orden_id,
        comprador_identidad_fiscal_id,
        comprador_nombre_completo,
        comprador_domicilio_fiscal,
        vendedor_identidad_fiscal_id,
        vendedor_nombre_completo,
        vendedor_domicilio_fiscal
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
`;


router.post('/orden', requireAuthAPI, async (req: Request, res: Response) => {
	const comprador_username = req.session.usuario?.username;

	const { producto_id, numero_tarjeta, CVV, fecha_vencimiento, direccion, cantidad } = req.body;
	if (!producto_id || !numero_tarjeta || !CVV || !fecha_vencimiento || !direccion || !cantidad) {
		throw new HttpError(400, "Faltan datos para procesar la compra");
	}

	const client = await pool.connect();

	try {
		await executeQuery("BEGIN", [], undefined, client);

		const info_producto = await executeQuery(query_obtenerProducto, [producto_id], undefined, client);
		if (info_producto.rows.length === 0) throw new HttpError(400, "Producto no encontrado");

		const { vendedor_username, producto_nombre, precio, stock } = info_producto.rows[0];
		if (stock < cantidad) throw new HttpError(400, "No hay stock suficiente");

		await executeQuery(query_descontarStock, [cantidad, producto_id], undefined, client);

		const identidades_fiscales = await executeQuery(
			query_obtenerIdentidades,
			[comprador_username, vendedor_username],
			undefined,
			client
		);
		console.log("Ids: ", identidades_fiscales.rows);
		if (identidades_fiscales.rows.length === 0) throw new HttpError(500, "Faltan identidades fiscales");

		const r = identidades_fiscales.rows[0];

		if (!usarTarjeta(numero_tarjeta, CVV, fecha_vencimiento)) {
			await executeQuery(query_devolverStock, [cantidad, producto_id], undefined, client);
			throw new HttpError(400, "El pago fue rechazado");
		}

		const orden = await executeQuery(
			query_crearOrden,
			[producto_id, producto_nombre, comprador_username, vendedor_username, direccion, cantidad, precio],
			undefined,
			client
		);
		const orden_id = orden.rows[0].orden_id;

		await executeQuery(
			query_crearFactura,
			[
				orden_id,
				r.comprador_cuil,
				r.comprador_nombre,
				r.comprador_domicilio,
				r.vendedor_cuil,
				r.vendedor_nombre,
				r.vendedor_domicilio
			],
			undefined,
			client
		);

		await executeQuery("COMMIT", [], undefined, client);

		return res.status(201).json({
			mensaje: "Compra realizada con éxito",
			orden_id: orden_id
		});

	} catch (err) {
		await executeQuery("ROLLBACK", [], undefined, client);
		throw err;
	} finally {
		client.release();
	}
});

const filterOrdenId = new FiltroSimple("orden_id");
const filterUsernameOrdenes: QueryFilter = {
	nombre: "username",
	aplica(query_params) {
		return query_params["username"] !== undefined;
	},
	condicion(i) {
		return `(comprador_username = $${i + 1} OR vendedor_username = $${i + 1})`;
	},
	valor(query_params) {
		return [query_params["username"]];
	}
};


router.get("/orden", requireAuthAPI, async (req: Request, res: Response) => {
	const username = req.session.usuario?.username;
	if (!username) {
		return res.status(401).json({ error: "No autenticado" });
	}

	const ordenId = req.query["orden_id"] as string | undefined;

	const query_base = `SELECT * FROM terox.ordenes`;

	const { query, params } = añadirFiltrosPermitidosAQuery(
		query_base, { username: username, orden_id: ordenId },
		[filterOrdenId, filterUsernameOrdenes]);

	const resultado = await executeQuery(query, params);

	if (ordenId) {
		if (resultado.rows.length === 0) {
			return res.status(404).json({ error: "Orden no encontrada" });
		}
		return res.json(resultado.rows[0]);
	}

	const compras = resultado.rows.filter(r => r.comprador_username === username);
	const ventas = resultado.rows.filter(r => r.vendedor_username === username);

	return res.json([compras, ventas]);
});

export default router;

function usarTarjeta(n: string, c: string, f: string): boolean {
	console.log(n, c, f);
	return Math.random() > 0.2;
}

