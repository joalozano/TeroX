import { executeQuery } from "../services/queryExecutor";

export async function obtenerNombresTablas(tabla: string) {
	const query_metadata = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema='terox' AND table_name=$1
    `;
	const res = await executeQuery(query_metadata, [tabla]);
	return res.rows.map(r => r.column_name);
}

export let atributos_producto: string[] = [];
export let atributos_usuario: string[] = [];
export let atributos_identidad_fiscal: string[] = [];

export async function initMetadataTablas() {
	console.log("Inicializando metadatos de tablas...");
	atributos_producto = await obtenerNombresTablas("productos");
	atributos_usuario = await obtenerNombresTablas("usuarios");
	atributos_identidad_fiscal = await obtenerNombresTablas("identidad_fiscal");
}
