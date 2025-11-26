import { QueryFilter } from "../types/queryfilters";

export function añadirFiltrosPermitidosAQuery(
	query_base: string,
	query_params: Record<string, string | undefined>,
	filtros: QueryFilter[]
) {
	let query = query_base;
	let valores: any[] = [];
	const condiciones: string[] = [];

	for (const filtro of filtros) {
		if (filtro.aplica(query_params)) {
			const condicion = filtro.condicion(valores.length, query_params);
			condiciones.push(condicion);

			valores = [...valores, ...filtro.valor(query_params)];
		}
	}

	if (condiciones.length > 0) {
		query += ` WHERE ` + condiciones.join(" AND ");
	}

	return {
		query,
		params: valores
	};
}
