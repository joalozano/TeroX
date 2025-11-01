import pool from "../config/db";
import { HttpError } from "../utils/http-error";

export async function executeQuery(
    query: string,
    queryParams: any[] = [],
    errorMessage = 'Error interno del servidor'
) {
    try {
        const result = await pool.query(query, queryParams);
        return result;
    } catch (error) {
    console.error('[DB ERROR]', error);
    throw new HttpError(400, errorMessage);
    }
}
