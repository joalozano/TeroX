import { Router } from "express";
import { requireAuthAPI } from "../middlewares/middlewares-auth";
import { verificar_usuario_es_dueño_del_producto } from "../middlewares/middlewares-productos";
import upload from "../config/uploads-multer";
import { obtenerImagenPorProducto, crearImagen, actualizarImagen } from "../services/image-services";

import { HttpError } from "../types/http-error";

const router = Router();

router.get("/uploads/:id", async (req, res) => {
  const id_producto = Number(req.params["id"]);
  const error_para_cliente = "Error: no se pudo obtener la imagen";

  const absolutePath = await obtenerImagenPorProducto(id_producto);
  return res.sendFile(absolutePath, (err) => {
    if (err) {
      console.error("[ERROR] al enviar el archivo:", err);
      throw new HttpError(500, error_para_cliente);
     }
   });

});

router.post("/uploads/:id", requireAuthAPI, verificar_usuario_es_dueño_del_producto, upload.single("imagen"),
  async (req, res) => {

    const id_producto = Number(req.params["id"]);
    const file = req.file;

    if (!file || !file.filename) {
      throw new HttpError(400, "No se subió ningún archivo");
    }

    const imagen = await crearImagen(id_producto, file.filename);

    return res.status(201).json({
      mensaje: "Imagen guardada correctamente",
      id: imagen.imagen_id,
      url: imagen.url,
    });
  }
);

router.put("/uploads/:id", requireAuthAPI, verificar_usuario_es_dueño_del_producto, upload.single("imagen"),
  async (req, res) => {

    const id_producto = Number(req.params["id"]);
    const file = req.file;

    if (!file) {
      throw new HttpError(400, "No se subió ningún archivo");
    }

    const imagen = await actualizarImagen(id_producto, file.filename);

    return res.status(200).json({
      mensaje: "Imagen guardada correctamente",
      id: imagen.imagen_id,
      url: imagen.url,
    });
  }
);

export default router;
