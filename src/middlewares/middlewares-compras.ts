import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/http-error';
import { executeQuery } from '../services/queryExecutor';

// lo voy a cambiar para que simplmenete añada al query param un query param user que busque en ambas
export async function requiere_usuario_aparece_en_orden(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	const username = req.session.usuario?.username;
	const orden_id = req.params['id'];

	const query = `
		SELECT comprador_username, vendedor_username
		FROM terox.ordenes
		WHERE orden_id = $1
	`;

	const result = await executeQuery(query, [orden_id]);

	if (!result) {
		throw new HttpError(400, 'Error: no se pudo autenticar');
	} else {
		const { comprador_username, vendedor_username } = result.rows[0] || {};
		if (username !== comprador_username && username !== vendedor_username) {
			throw new HttpError(403, 'Error: no tienes permiso para acceder a esta orden');
		} else {
			next();
		}
	}
}

export async function requiere_identidades_fiscales_para_compra(
	req: Request,
	_res: Response,
	next: NextFunction
) {
    // aca puede cambiar todavia no se como me llega la info
	const producto_id = req.body.producto_id ?? req.params['producto_id'] ?? req.params['id'];
	const comprador_username = req.body.comprador_username ?? req.body.username ?? req.params['comprador_username'] ?? req.session.usuario?.username;

	if (!producto_id) {
		throw new HttpError(400, 'Error: no se proporcionó producto_id');
	}
	if (!comprador_username) {
		throw new HttpError(400, 'Error: no se proporcionó comprador_username');
	}

	const query = `
		SELECT p.username AS vendedor_username,
			(SELECT COUNT(*) FROM terox.identidad_fiscal WHERE username = $2) AS comprador_count,
			(SELECT COUNT(*) FROM terox.identidad_fiscal WHERE username = p.username) AS vendedor_count
		FROM terox.productos p
		WHERE p.producto_id = $1
	`;

	const result = await executeQuery(query, [producto_id, comprador_username]);

	if (!result || result.rows.length === 0) {
		throw new HttpError(400, 'Error: producto no encontrado');
	}

	const row = result.rows[0];
	const comprador_count = Number(row.comprador_count);
	const vendedor_count = Number(row.vendedor_count);

	if (comprador_count === 0) {
		throw new HttpError(400, 'Error: comprador no tiene identidad fiscal registrada');
	}
	if (vendedor_count === 0) {
		throw new HttpError(400, 'Error: vendedor no tiene identidad fiscal registrada');
	}

	next();
}


// COMPLETAR
// aca hay que crear la factura y añadir el id de la factura al body para que se añada a la orden
export function validar_tarjeta(
	_req: Request,
	_res: Response,
	next: NextFunction
) {
    next();
}