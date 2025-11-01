import { Router } from "express";
import { generarDataDelBody } from "../utils/body-utils";
import { eliminarNullsDeRecord } from "../utils/record-utils";
import { enviar_error_con_status, enviar_exito_con_status } from "./interfaces";
import { executeQuery } from "../services/queryExecutor";

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
		const query = `SELECT * FROM ${table_name}`;
		const result = await executeQuery(query, [], `Error al obtener de ${table_name}`);

		return res.json(result.rows);
	});

	router.post(ruta_api, ...(middlewares.post), async (req, res) => {
		const data: Record<string, string | null> = generarDataDelBody(req, atributos);

		const columnas = atributos.join(", ");
		const placeholders = atributos.map((_, i) => `$${i + 1}`).join(", ");
		const valores = atributos.map(attr => data[attr]);

		const query = `INSERT INTO ${table_name} (${columnas}) VALUES (${placeholders}) RETURNING ${nombre_clave_primaria}`;
		const result = await executeQuery(query, valores, `Error al agregar a ${table_name}`);

		return res.status(201).json({
			mensaje: 'Se agregó exitosamente',
			id: result.rows[0][nombre_clave_primaria]
		});
	});

	router.put(`${ruta_api}/:id`, ...(middlewares.put), async (req, res) => {
		const id = req.params['id'];
		if (!id) {
			return enviar_error_con_status(res, 400, "Datos inválidos");
		}

		const data_raw = generarDataDelBody(req, atributos);
		const data: Record<string, string | null> = eliminarNullsDeRecord(data_raw);
		const atributos_a_actualizar = Object.keys(data);

		if (atributos_a_actualizar.length === 0) {
			return enviar_error_con_status(res, 400, "No se proporcionaron campos para actualizar");
		}

		const placeholders = atributos_a_actualizar
			.map((attr, i) => `${attr} = $${i + 1}`)
			.join(", ");
		const valores = atributos_a_actualizar.map(attr => data[attr]);

		const query = `UPDATE ${table_name} SET ${placeholders} WHERE ${nombre_clave_primaria} = $${valores.length + 1}`;
		await executeQuery(query, [...valores, id], `Error al editar en ${table_name}`);

		return enviar_exito_con_status(res, 200, 'Edición exitosa');
	});

	router.delete(`${ruta_api}/:id`, ...(middlewares.delete), async (req, res) => {
		const id = req.params["id"];
		if (!id) {
			return enviar_error_con_status(res, 400, "Datos inválidos");
		}

		const query = `DELETE FROM ${table_name} WHERE ${nombre_clave_primaria} = $1`;
		await executeQuery(query, [id], `Error al eliminar de ${table_name}`);

		return res.status(200).json({ borrado: id });
	});

	return router;
}
