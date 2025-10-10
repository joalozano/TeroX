import { Request } from 'express';

export function generarDataDelBody(req: Request, atributos: string[]) {
	const data: Record<string, string | null> = {};
	for (const atributo of atributos) {
		data[atributo] = req.body[atributo] ?? null;
	}
	return data;
}

