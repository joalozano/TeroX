import { mostrarNotificacion } from "./mostrar-notificacion.js";

export async function subirImagen(
    urlBase: string,
    idProducto: number,
    inputFile: HTMLInputElement,
    metodo: string = "POST"
): Promise<{ ok: boolean; mensaje: string; data?: any }> {

    if (!inputFile.files || inputFile.files.length === 0) {
        const mensaje = "No se seleccionó ninguna imagen";
        mostrarNotificacion(mensaje, "error");
        return { ok: false, mensaje };
    }

    const formData = new FormData();
    formData.append("imagen", inputFile.files[0] as Blob);

    try {
        const response = await fetch(`${urlBase}/${idProducto}`, {
            method: metodo,
            body: formData
        });

        if (response.ok) {
            const data = await response.json();

            mostrarNotificacion("Imagen subida correctamente", "success");

            return { ok: true, mensaje: "Imagen subida correctamente", data };
        } else {
            const errorData = await response.json();
            const mensaje = errorData.error || "Error al subir la imagen";

            mostrarNotificacion(mensaje, "error");

            return { ok: false, mensaje };
        }
    } catch (error) {
        console.error("Error en el upload:", error);

        const mensaje = "Error de conexión al subir la imagen";
        mostrarNotificacion(mensaje, "error");

        return { ok: false, mensaje };
    }
}

