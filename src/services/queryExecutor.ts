import pool from "../config/db";

export async function executeQuery(
    query: string,
    queryParams: any[] = [],
    errorMessage = 'Error ejecutando la consulta'
) {
    try {
        const result = await pool.query(query, queryParams);
        return result;
    } catch (error) {
        console.error(`${errorMessage}:`, (error as Error).message);
        return null;
    }
}
