import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/http-error';

export function validar_tarjeta(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	const { producto_id, numero_tarjeta, CVV, fecha_vencimiento, direccion, cantidad } = req.body;
	if (!producto_id || !numero_tarjeta || !CVV || !fecha_vencimiento || !direccion || !cantidad) {
		throw new HttpError(400, "Faltan datos para procesar la compra");
	}
	next();
}
