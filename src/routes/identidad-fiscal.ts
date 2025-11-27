import { Router, Request, Response } from "express";
import { executeQuery } from "../services/queryExecutor";
import { requireAuthAPI } from "../middlewares/middlewares-auth";
import { HttpError } from "../types/http-error";

export default function generarEndPointIdFiscal(url: string, nombre_clave_primaria: string, atributos: string[]) {

    const router = Router();
    const table_name = `terox.${url.slice(1)}`;

    router.post(url, requireAuthAPI, async (req: Request, res: Response) => {
        const username = req.session.usuario?.username;

        const columnas = atributos;
        const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

        const valores = columnas.map(col => col === "username" ? username : req.body[col]);

        const columnasActualizables = columnas
            .filter(col => col !== "username")
            .map(col => `${col} = EXCLUDED.${col}`)
            .join(", ");

        const query = `
            INSERT INTO ${table_name} (${columnas.join(", ")})
            VALUES (${placeholders})
            ON CONFLICT (username)
            DO UPDATE SET ${columnasActualizables}
            RETURNING *, (xmax = 0) AS was_inserted;
        `;

        const result = await executeQuery(query, valores);
        const fueInsert = result.rows[0].was_inserted;

        return res.status(201).json({
            success: true,
            mensaje: fueInsert ? "Identidad fiscal creada" : "Identidad fiscal actualizada",
            data: result.rows[0][nombre_clave_primaria]
        });
    });

    router.get(url, requireAuthAPI, async (req: Request, res: Response) => {
        const username = req.session.usuario?.username;

        const query = `
            SELECT ${atributos.join(", ")}
            FROM ${table_name}
            WHERE username = $1
        `;

        const result = await executeQuery(query, [username]);

        if (result.rows.length === 0) {
            throw new HttpError(404, "No se encontró identidad fiscal para este usuario");
        }

        return res.status(201).json(result.rows);
    });

    return router;
}
