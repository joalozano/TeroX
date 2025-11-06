function filtrarQueryParams(query_params: Record<string, string | undefined>,
	allowedParams: string[]): Record<string, string> {

	const filteredParams: Record<string, string> = {};
	for (const param of allowedParams) {
		const value = query_params[param];
		if (value && value !== 'null' && value !== 'undefined') {
			filteredParams[param] = value;
		}
	}
	return filteredParams;
}

export function añadirFiltrosPermitidosAQuery(query_base: string,
	query_params: Record<string, string | undefined>, allowedParams: string[]) {

	let query = query_base;
	const params = filtrarQueryParams(query_params, allowedParams);
	const filtros = Object.keys(params);

	if (filtros.length > 0) {
		const condiciones = filtros.map((param, i) => {
			return `${param} = $${i + 1}`;
		}).join(" AND ");

		query += ` WHERE ${condiciones}`;
	}

	return { query, params: Object.values(params) };
}
