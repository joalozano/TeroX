import { Router } from "express";
import pool from "../config/db";

export default function generarCRUD(ruta_api: string, nombre_clave_primaria: string, atributos: string[]) {

	const router = Router();
	const table_name = `terox.${ruta_api.slice(1)}`;


	router.get(ruta_api, async (_, res) => {
		try {
			const items = await pool.query(`SELECT * FROM ${table_name}`);
			return res.json(items.rows);
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error al obtener producto:", error.message);
			} else {
				console.error("Error desconocido:", error);
			}
			return res.status(400).json({ error: 'Error: no se pudo obtener los productos' });
		}


	});

	router.post(ruta_api, async (req, res) => {
		const data: Record<string, string | number | null> = {};
		for (const atributo of atributos) {
			data[atributo] = req.body[atributo] ?? null;
		}

		const columnas = atributos.join(", ");
		const placeholders = atributos.map((_, i) => `$${i + 1}`).join(", ");
		const valores = atributos.map(attr => data[attr]);

		const query = `INSERT INTO ${table_name} (${columnas}) VALUES (${placeholders})`;

		try {
			await pool.query(query, valores);
			return res.sendStatus(200);
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error al agregar producto:", error.message);
			} else {
				console.error("Error desconocido:", error);
			}

			return res.status(400).json({ error: 'Error: no se pudo agregar el producto' });
		}
	});

	router.put(ruta_api, async (req, res) => {
		const id = req.body[nombre_clave_primaria];
		if (!id) {
			return res.status(400).json({ error: "Datos Invalidos" });
		}

		const data: Record<string, string | null> = {};
		for (const atributo of atributos) {
			const valor = req.body[atributo] ?? null;
			if (valor !== null) data[atributo] = valor;
		}

		const keys = Object.keys(data);
		if (keys.length === 0) {
			return res.status(400).json({ error: "No se proporcionaron campos para actualizar" });
		}

		const sets = keys.map((attr, i) => `${attr} = $${i + 1}`).join(", ");
		const valores = keys.map(attr => data[attr]);
		const query = `UPDATE ${table_name} SET ${sets} WHERE ${nombre_clave_primaria} = $${valores.length + 1}`;

		try {
			await pool.query(query, [...valores, id]);
			return res.sendStatus(200);
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error al editar producto:", error.message);
			} else {
				console.error("Error desconocido:", error);
			}
			return res.status(400).json({ error: 'Error: no se pudo editar el producto' });
		}
	});

	router.delete(ruta_api, async (req, res) => {
		const id = req.body[nombre_clave_primaria];
		if (!id) {
			return res.status(400).json({ error: "Datos Invalidos" });
		}

		try {
			await pool.query(`DELETE FROM ${table_name} WHERE ${nombre_clave_primaria} = $1`, [id]);
			return res.status(200).json({ borrado: id });
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error al eliminar producto:", error.message);
			} else {
				console.error("Error desconocido:", error);
			}

			return res.sendStatus(400);
		}

	});

	return router;
}
