import { Router } from "express";
import { requireAuth } from "../middlewares/middlewares-auth";

import pool from "../config/db";
import upload from "../config/uploads-multer";
import path from "path";
import fs from "fs";

const router = Router();

router.get("/uploads/:id_producto", requireAuth, async (req, res) => {
    const id_producto = req.params['id_producto'];

    const error_para_cliente = 'Error: no se pudo obtener la imagen';

    try {
        const query = 'SELECT url FROM terox.imagenes WHERE producto_id = $1';
        const result = await pool.query(query, [id_producto]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: error_para_cliente });
        }

        const fileName = result.rows[0].url;
        const absolutePath = path.resolve(__dirname, "../../uploads", fileName);

        return res.sendFile(absolutePath, (err) => {
            if (err) {
                console.error(err);
                res.status(404).json({ error: error_para_cliente });
            }
        });

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error al obtener la url de la imagen:", error.message);
        } else {
            console.error("Error desconocido:", error);
        }

        return res.status(400).json({ error: error_para_cliente });
    }
});


router.post("/uploads/:id_producto", requireAuth, upload.single("imagen"), async (req, res) => {
    const id_producto = req.params['id_producto'];
    const file = req.file;

    const error_para_cliente = 'Error: no se pudo guardar la imagen';

    if (!file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    try {
        const filePath = file.filename;

        const query = `
      INSERT INTO terox.imagenes (producto_id, url)
      VALUES ($1, $2) RETURNING id, url
    `;
        const valores = [id_producto, filePath];
        try {
            await pool.query(query, valores);
            return res.status(201).json({
                mensaje: "Imagen guardada correctamente",
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error al guardar la imagen en la base de datos:", error.message);
            } else {
                console.error("Error desconocido al guardar la imagen en la base de datos:", error);
            }
            return res.status(400).json({ error: error_para_cliente });
        }
    } catch (error) {
        return res.status(500).json({ error: error_para_cliente });
    }
});


router.put("/uploads/:id_producto", requireAuth, upload.single("imagen"), async (req, res) => {
    const id_producto = req.params['id_producto'];
    const file = req.file;
    const error_para_cliente = 'Error: no se pudo guardar la imagen';

    if (!file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    try {
        const filePath = file.filename;

        const result = await pool.query(
            'SELECT url FROM terox.imagenes WHERE producto_id = $1 LIMIT 1',
            [id_producto]
        );

        if (result.rows.length > 0) {
            const archivoAnterior = path.join(__dirname, "../../uploads", result.rows[0].url);
            if (fs.existsSync(archivoAnterior)) {
                fs.unlinkSync(archivoAnterior);
            }

            const queryUpdate = 'UPDATE terox.imagenes SET url = $1 WHERE producto_id = $2 RETURNING id, url';
            const valoresUpdate = [filePath, id_producto];
            await pool.query(queryUpdate, valoresUpdate);

        } else {
            const queryInsert = 'INSERT INTO terox.imagenes (producto_id, url) VALUES ($1, $2) RETURNING id, url';
            const valoresInsert = [id_producto, filePath];
            await pool.query(queryInsert, valoresInsert);
        }

        return res.status(201).json({
            mensaje: "Imagen guardada correctamente",
        });

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error al guardar la imagen:", error.message);
        } else {
            console.error("Error desconocido al guardar la imagen:", error);
        }
        return res.status(500).json({ error: error_para_cliente });
    }
});

export default router;
