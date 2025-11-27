import { Request, Response, NextFunction } from "express";
import { hashPassword } from "../utils/crypto-utils";
import { HttpError } from "../types/http-error";

// Middleware de autenticación para el frontend
export function requireAuth(req: Request, res: Response, next: NextFunction) {
	if (req.session.usuario) {
		next();
	} else {
		res.redirect('/login');
	}
}

// Middleware de autenticación para el backend
export function requireAuthAPI(req: Request, _: Response, next: NextFunction) {
	if (req.session.usuario) {
		next();
	} else {
		const errorMessage = 'No autenticado. Por favor, inicie sesión para continuar.';
		throw new HttpError(400, errorMessage);
	}
}

export async function replacePasswordForHash(req: Request, _res: Response, next: NextFunction) {
	const password = req.body.password;
	if (!password) {
		const errorMessage = "Datos inválidos";
		throw new HttpError(400, errorMessage);
	}
	try {
		req.body.password_hash = await hashPassword(password);
		delete req.body.password;
		next();

	} catch (error) {
		console.error("Error al hashear contraseña:", error);
		throw new HttpError(500, "Error interno del servidor");
	}
}

export function requireParamIgualAUsuarioLogueado(req: Request, _res: Response, next: NextFunction) {
	const query = req.query as Record<string, string | undefined>;

	if (req.session.usuario?.username !== query['username']) {
		const errorMessage = "No se puede obtener info de otro usuario";
		throw new HttpError(400, errorMessage);
	}
	next();
}
