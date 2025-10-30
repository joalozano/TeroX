import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';

export function añadir_usuario_id_a_request(
	req: Request, _: Response,
	next: NextFunction
) {
	req.body.usuario_id = req.session.usuario?.usuario_id;
	next();
}

export async function verificar_usuario_es_dueño_del_producto(
	req: Request,
	res: Response,
	next: NextFunction
) {

	const usuario_id = req.session.usuario?.usuario_id;
	const producto_id = req.params['id'];

	const query = 'SELECT usuario_id FROM terox.productos WHERE producto_id = $1';

	try {
		const producto_dueño_id = await pool.query(query, [producto_id]).then(result => result.rows[0]?.usuario_id);
		if (usuario_id !== producto_dueño_id) {
			res.status(403).json({ error: 'No autorizado para modificar este producto' });
		} else {
			next();
		}


	} catch (error) {
		if (error instanceof Error) {
			console.error("Error al verificar usuario sea dueño:", error.message);
		} else {
			console.error("Error desconocido:", error);
		}

		res.status(400).json({ error: 'Error: no se pudo autenticar' });
	}
}
