import path from "path";
import fs from "fs";
import { executeQuery } from "./queryExecutor.js";
import { HttpError } from "../types/http-error.js";

const UPLOADS_PATH = path.resolve(__dirname, "../../uploads");

export async function obtenerImagenPorProducto(id_producto: number): Promise<string> {
  const query = "SELECT url FROM terox.imagenes WHERE producto_id = $1";
  const result = await executeQuery(
    query,
    [id_producto],
    "Error al obtener la URL de la imagen"
  );

  if (!result?.rows?.length) {
    throw new HttpError(404, "No se encontró la imagen del producto");
  }

  const fileName = result.rows[0].url;
  const absolutePath = path.join(UPLOADS_PATH, fileName);

  if (!fs.existsSync(absolutePath)) {
    throw new HttpError(404, "La imagen no existe en el servidor");
  }

  return absolutePath;
}

export async function crearImagen(id_producto: number, filePath: string): Promise<{ imagen_id: number; url: string }> {
  const query = `
    INSERT INTO terox.imagenes (producto_id, url)
    VALUES ($1, $2)
    RETURNING imagen_id, url
  `;
  const valores = [id_producto, filePath];

  const result = await executeQuery(query, valores, "Error al guardar la imagen");

  if (!result) throw new HttpError(400, "Error: no se pudo guardar la imagen");

  return result.rows[0];
}

export async function actualizarImagen(id_producto: number, filePath: string): Promise<{ imagen_id: number; url: string }> {
  const error_para_cliente = "Error al guardar la imagen";

  const result = await executeQuery(
    "SELECT url FROM terox.imagenes WHERE producto_id = $1 LIMIT 1",
    [id_producto],
    error_para_cliente
  );

  if (result.rows.length > 0) {

    const anterior = path.join(UPLOADS_PATH, result.rows[0].url);
    borrarImagen(anterior);

    const queryUpdate = `
      UPDATE terox.imagenes
      SET url = $1
      WHERE producto_id = $2
      RETURNING imagen_id, url
    `;
    const valoresUpdate = [filePath, id_producto];

    const updateResult = await executeQuery(
      queryUpdate,
      valoresUpdate,
      error_para_cliente
    );

    return updateResult.rows[0];
  }

  // si no existe, crear una nueva
  return await crearImagen(id_producto, filePath);
}

export function borrarImagen(fileName: string): void {
  const ruta = path.join(UPLOADS_PATH, fileName);
  if (fs.existsSync(ruta)) {
    fs.unlinkSync(ruta);
  } else {
    console.warn("Imagen no existe", ruta);
  }
}
