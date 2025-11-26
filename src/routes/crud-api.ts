import { Router } from "express";
import { generarDataDelBodyConWhiteList } from "../utils/body-utils";
import { eliminarNullsDeRecord } from "../utils/record-utils";
import { enviar_exito_con_status } from "./interfaces";
import { executeQuery } from "../services/queryExecutor";
import { HttpError } from "../types/http-error";
import { añadirFiltrosPermitidosAQuery } from "../utils/query-utils";

const middlewareVacio: MiddlewareCRUD = {
	get: [],
	post: [],
	put: [],
	delete: []
}

export default function generarCRUD
	(ruta_base: string, nombre_clave_primaria: string, atributos: string[],
		middlewares: MiddlewareCRUD = middlewareVacio,
		get_query_params: string[], clave_primaria_autogenerada: boolean): Router {

	const router = Router();
	const table_name = `terox.${ruta_base.slice(1)}`;

	router.get(ruta_base, ...(middlewares.get), async (req, res) => {
		const { query, params } = añadirFiltrosPermitidosAQuery(`SELECT * FROM ${table_name}`,
			req.query as Record<string, string | undefined>, get_query_params);
		const result = await executeQuery(query, params, `Error al obtener de ${table_name}`);

		return res.json(result.rows);
	});

	router.post(ruta_base, ...(middlewares.post), async (req, res) => {
		const atributos_post = clave_primaria_autogenerada ?
			atributos.filter(attr => attr !== nombre_clave_primaria) : atributos;
		console.log(req.body);
		const data_raw: Record<string, string | null> = generarDataDelBodyConWhiteList(req, atributos_post);
		const data = eliminarNullsDeRecord(data_raw);
		

		
		const atributos_a_insertar = Object.keys(data);

		const columnas = atributos_a_insertar.join(", ");
		const placeholders = atributos_a_insertar.map((_, i) => `$${i + 1}`).join(", ");
		const valores = atributos_a_insertar.map(attr => data[attr]);

		const query = `INSERT INTO ${table_name} (${columnas}) VALUES (${placeholders}) RETURNING ${nombre_clave_primaria}`;
		const result = await executeQuery(query, valores, `Error al agregar a ${table_name}`);

		return res.status(201).json({
			mensaje: 'Se agregó exitosamente',
			id: result.rows[0][nombre_clave_primaria]
		});
	});

	router.put(`${ruta_base}/:id`, ...(middlewares.put), async (req, res) => {
		const id = req.params['id'];

		const data_raw = generarDataDelBodyConWhiteList(req, atributos);
		const data: Record<string, string | null> = eliminarNullsDeRecord(data_raw);
		const atributos_a_actualizar = Object.keys(data);

		if (atributos_a_actualizar.length === 0) {
			throw new HttpError(400, "No se proporcionaron campos para actualizar");
		}

		const placeholders = atributos_a_actualizar
			.map((attr, i) => `${attr} = $${i + 1}`)
			.join(", ");
		const valores = atributos_a_actualizar.map(attr => data[attr]);

		const query = `UPDATE ${table_name} SET ${placeholders} WHERE ${nombre_clave_primaria} = $${valores.length + 1}`;
		await executeQuery(query, [...valores, id], `Error al editar en ${table_name}`);

		return enviar_exito_con_status(res, 200, 'Edición exitosa');
	});

	router.delete(`${ruta_base}/:id`, ...(middlewares.delete), async (req, res) => {
		const id = req.params["id"];

		const query = `DELETE FROM ${table_name} WHERE ${nombre_clave_primaria} = $1`;
		await executeQuery(query, [id], `Error al eliminar de ${table_name}`);

		return res.status(200).json({ borrado: id });
	});

	return router;
}
