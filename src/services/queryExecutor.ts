import { Pool, Client, PoolClient } from "pg";
import pool from "../config/db";
import { HttpError } from "../types/http-error";

export async function executeQuery(
    query: string,
    queryParams: any[] = [],
    errorMessage = 'Error interno del servidor',
    client: Pool | Client | PoolClient = pool
) {
    try {
        const result = await client.query(query, queryParams);
        return result;
    } catch (error) {
        console.error('[DB ERROR]', error);
        throw new HttpError(400, errorMessage);
    }
}
