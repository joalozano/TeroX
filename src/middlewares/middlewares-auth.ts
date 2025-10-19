import { Request, Response, NextFunction } from "express";
import { hashPassword } from '../utils/crypto-utils'

// Middleware de autenticación para el frontend
export function requireAuth(req: Request, res: Response, next: NextFunction) {
	if (req.session.usuario) {
		next();
	} else {
		res.redirect('/login');
	}
}

// Middleware de autenticación para el backend
export function requireAuthAPI(req: Request, res: Response, next: NextFunction) {
	if (req.session.usuario) {
		next();
	} else {
		res.status(401).json({ error: 'No autenticado' });
	}
}

export async function replacePasswordForHash(req: Request, res: Response, next: NextFunction) {
	try {
		const password = req.body.password;
		if (!password) {
			res.status(400).json({ error: "Contraseña no proporcionada o inválida" });
		} else {

			req.body.password_hash = await hashPassword(password);
			delete req.body.password;

			next();
		}

	} catch (error) {
		console.error("Error al hashear contraseña:", error);
		res.status(500).json({ error: "Error interno al procesar la contraseña" });
	}
}
