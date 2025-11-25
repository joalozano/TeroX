import { Request } from 'express';

export function generarDataDelBodyConWhiteList(req: Request, atributosWhiteList: string[]) {
	const data: Record<string, string | null> = {};
	for (const atributo of atributosWhiteList) {
		data[atributo] = req.body[atributo] ?? null;
	}
	return data;
}
