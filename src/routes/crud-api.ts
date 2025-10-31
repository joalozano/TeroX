import { Router } from "express";
import { generarDataDelBody } from "../utils/body-utils";
import { eliminarNullsDeRecord } from "../utils/record-utils";
import pool from "../config/db";
import { enviar_error_con_status, enviar_exito_con_status } from "./interfaces";

const middlewareVacio: MiddlewareCRUD = {
	get: [],
	post: [],
	put: [],
	delete: []
}

export default function generarCRUD
	(ruta_api: string, nombre_clave_primaria: string, atributos: string[],
		middlewares: MiddlewareCRUD = middlewareVacio) {

	const router = Router();
	const table_name = `terox.${ruta_api.slice(1)}`;


	router.get(ruta_api, ...(middlewares.get), async (_, res) => {
		try {
			const items = await pool.query(`SELECT * FROM ${table_name}`);
			return res.json(items.rows);
		} catch (error) {
			if (error instanceof Error) {
				console.error(`Error al obtener de ${table_name}:`, error.message);
			} else {
				console.error(`Error desconocido al obtener de ${table_name}:`, error);
			}
			return enviar_error_con_status(res, 400, "Error al obtener los datos");
		}


	});

	router.post(ruta_api, ...(middlewares.post), async (req, res) => {
		const data: Record<string, string | null> = generarDataDelBody(req, atributos);

		const columnas = atributos.join(", ");
		const placeholders = atributos.map((_, i) => `$${i + 1}`).join(", ");
		const valores = atributos.map(attr => data[attr]);

		const query = `INSERT INTO ${table_name} (${columnas}) VALUES (${placeholders}) RETURNING ${nombre_clave_primaria}`;

		try {
			const resultado = await pool.query(query, valores);
			return res.status(201).json({
				mensaje: 'Se agregó exitosamente',
				id: resultado.rows[0][nombre_clave_primaria]
			});
		} catch (error) {
			if (error instanceof Error) {
				console.error(`Error al agregar a ${table_name}:`, error.message);
			} else {
				console.error(`Error desconocido a agregar a ${table_name}`, error);
			}

			return res.status(400).json({ error: 'Error: no se pudo realizar la operacion' });
		}
	});

	router.put(`${ruta_api}/:id`, ...(middlewares.put), async (req, res) => {
		const id = req.params['id'];
		if (!id) {
			return res.status(400).json({ error: "Datos Invalidos" });
		}

		const data_raw = generarDataDelBody(req, atributos);
		const data: Record<string, string | null> = eliminarNullsDeRecord(data_raw);


		const atributos_a_actualizar = Object.keys(data);
		if (atributos_a_actualizar.length === 0) {
			return res.status(400).json({ error: "No se proporcionaron campos para actualizar" });
		}

		const placeholders = atributos_a_actualizar.map((attr, i) => `${attr} = $${i + 1}`).join(", ");
		const valores = atributos_a_actualizar.map(attr => data[attr]);

		const query = `UPDATE ${table_name} SET ${placeholders} WHERE ${nombre_clave_primaria} = $${valores.length + 1}`;

		try {
			await pool.query(query, [...valores, id]);
			return enviar_exito_con_status(res, 200, 'Edicion exitos');
		} catch (error) {
			if (error instanceof Error) {
				console.error(`Error al editar en ${table_name}:`, error.message);
			} else {
				console.error(`Error desconocido al editar en ${table_name}:`, error);
			}
			return enviar_error_con_status(res, 400, 'Error: no se pudo editar');
		}
	});

	router.delete(`${ruta_api}/:id`, ...(middlewares.delete), async (req, res) => {
		const id = req.params["id"];
		if (!id) {
			return enviar_error_con_status(res, 400, "Datos Invalidos");
		}

		try {
			await pool.query(`DELETE FROM ${table_name} WHERE ${nombre_clave_primaria} = $1`, [id]);
			return res.status(200).json({ borrado: id });
		} catch (error) {
			if (error instanceof Error) {
				console.error(`Error al eliminar de ${table_name}:`, error.message);
			} else {
				console.error(`Error desconocido al eliminar de ${table_name}:`, error);
			}
			return enviar_error_con_status(res, 400, 'Error: no se pudo eliminar el producto');
		}

	});

	return router;
}
