import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http-error';
import { executeQuery } from '../services/queryExecutor';

export async function requiere_usuario_es_dueño_de_identidad_fiscal(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	const username = req.session.usuario?.username;
	const cuil = req.params['cuil'];

	const query = 'SELECT username FROM terox.identidad_fiscal WHERE cuil = $1';

	const result = await executeQuery(query, [cuil]);

	if (!result) {
		throw new HttpError(400, 'Error: no se pudo autenticar');
	} else {
		const identidad_dueño = result.rows[0]?.username;
		if (username !== identidad_dueño) {
			throw new HttpError(403, 'Error: no tienes permiso para modificar esta identidad fiscal');
		} else {
			next();
		}
	}
}
