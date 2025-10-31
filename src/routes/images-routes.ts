import { Router } from "express";
import { requireAuth } from "../middlewares/middlewares-auth";

import { executeQuery } from "../services/queryExecutor";
import upload from "../config/uploads-multer";
import path from "path";
import fs from "fs";

const router = Router();

router.get("/uploads/:id_producto", async (req, res) => {
    const id_producto = req.params['id_producto'];
    const error_para_cliente = 'Error: no se pudo obtener la imagen';

    const query = 'SELECT url FROM terox.imagenes WHERE producto_id = $1';
    const result = await executeQuery(
        query,
        [id_producto],
        'Error al obtener la URL de la imagen'
    );

    if (!result) {
        return res.status(400).json({ error: error_para_cliente });
    }

    if (result.rows.length === 0) {
        return res.status(404).json({ error: error_para_cliente });
    }

    const fileName = result.rows[0].url;
    const absolutePath = path.resolve(__dirname, "../../uploads", fileName);

    return res.sendFile(absolutePath, (err) => {
        if (err) {
            console.error('Error al enviar el archivo:', err);
            res.status(404).json({ error: error_para_cliente });
        }
    });
});

router.post("/uploads/:id_producto", requireAuth, upload.single("imagen"), async (req, res) => {
    const id_producto = req.params['id_producto'];
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const filePath = file.filename;
    const query = `
    INSERT INTO terox.imagenes (producto_id, url)
    VALUES ($1, $2)
    RETURNING id, url
  `;
    const valores = [id_producto, filePath];

    const result = await executeQuery(
        query,
        valores,
        'Error al guardar la imagen en la base de datos'
    );

    const error_para_cliente = 'Error: no se pudo guardar la imagen';
    if (!result) {
        return res.status(400).json({ error: error_para_cliente });
    }

    return res.status(201).json({
        mensaje: "Imagen guardada correctamente",
        id: result.rows[0].id,
        url: result.rows[0].url,
    });
});

router.put("/uploads/:id_producto", requireAuth, upload.single("imagen"), async (req, res) => {
    const id_producto = req.params['id_producto'];
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const filePath = file.filename;

    const result = await executeQuery(
        'SELECT url FROM terox.imagenes WHERE producto_id = $1 LIMIT 1',
        [id_producto],
        'Error al buscar imagen existente'
    );

    const error_para_cliente = 'Error: no se pudo guardar la imagen';
    if (!result) {
        return res.status(400).json({ error: error_para_cliente });
    }

    if (result.rows.length > 0) {
        const archivoAnterior = path.join(__dirname, "../../uploads", result.rows[0].url);
        if (fs.existsSync(archivoAnterior)) {
            fs.unlinkSync(archivoAnterior);
        }

        const queryUpdate = `
      UPDATE terox.imagenes
      SET url = $1
      WHERE producto_id = $2
      RETURNING id, url
    `;
        const valoresUpdate = [filePath, id_producto];

        const updateResult = await executeQuery(
            queryUpdate,
            valoresUpdate,
            'Error al actualizar la imagen'
        );

        if (!updateResult) {
            return res.status(400).json({ error: error_para_cliente });
        }

        return res.status(200).json({
            mensaje: "Imagen actualizada correctamente",
            id: updateResult.rows[0].id,
            url: updateResult.rows[0].url,
        });
    }

    const queryInsert = `
    INSERT INTO terox.imagenes (producto_id, url)
    VALUES ($1, $2)
    RETURNING id, url
  `;
    const valoresInsert = [id_producto, filePath];

    const insertResult = await executeQuery(
        queryInsert,
        valoresInsert,
        'Error al insertar nueva imagen'
    );

    if (!insertResult) {
        return res.status(400).json({ error: error_para_cliente });
    }

    return res.status(201).json({
        mensaje: "Imagen guardada correctamente",
        id: insertResult.rows[0].id,
        url: insertResult.rows[0].url,
    });
});

export default router;
