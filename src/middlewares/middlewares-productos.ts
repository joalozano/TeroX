import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/http-error';
import { executeQuery } from '../services/queryExecutor';

export function añadir_username_a_request(
	req: Request, _: Response,
	next: NextFunction
) {
	req.body.username = req.session.usuario?.username;
	next();
}

export async function verificar_usuario_es_dueño_del_producto(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	const username = req.session.usuario?.username;
	const producto_id = req.params['id'];

	const query = 'SELECT username FROM terox.productos WHERE producto_id = $1';

	const result = await executeQuery(
		query,
		[producto_id]
	);

	if (!result) {
		const errorMessage = 'Error: no se pudo autenticar';
		throw new HttpError(400, errorMessage);
	} else {
		const producto_dueño_id = result.rows[0]?.username;
		if (username !== producto_dueño_id) {
			const errorMessage = 'Error: no tienes permiso para modificar este producto';
			throw new HttpError(403, errorMessage);
		} else {
			next();
		}
	}
}

export async function verificar_usuario_tiene_identidad_fiscal(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	const username = req.session.usuario?.username;

	const query = `
			SELECT 1
			FROM terox.identidad_fiscal
			WHERE username = $1
		`;

	const result = await executeQuery(query, [username]);

	if (result.rowCount === 0) {
		throw new HttpError(400, "El usuario no posee identidad fiscal registrada.");
	}

	next();
}

