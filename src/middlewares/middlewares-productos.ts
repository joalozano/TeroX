import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/http-error';
import { executeQuery } from '../services/queryExecutor';

export function añadir_usuario_id_a_request(
	req: Request, _: Response,
	next: NextFunction
) {
	req.body.usuario_id = req.session.usuario?.usuario_id;
	next();
}

export async function verificar_usuario_es_dueño_del_producto(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	const usuario_id = req.session.usuario?.usuario_id;
	const producto_id = req.params['id'];

	const query = 'SELECT usuario_id FROM terox.productos WHERE producto_id = $1';

	const result = await executeQuery(
		query,
		[producto_id]
	);

	if (!result) {
		const errorMessage = 'Error: no se pudo autenticar';
		throw new HttpError(400, errorMessage);
	} else {
		const producto_dueño_id = result.rows[0]?.usuario_id;
		if (usuario_id !== producto_dueño_id) {
			const errorMessage = 'Error: no tienes permiso para modificar este producto';
			throw new HttpError(403, errorMessage);
		} else {
			next();
		}
	}
}
