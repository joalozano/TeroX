export async function subirImagen(urlBase: string, idProducto: number, inputFile: HTMLInputElement) {
    if (!inputFile.files || inputFile.files.length === 0) {
        console.warn("No se seleccionó ningún archivo");
        return { ok: false, mensaje: "No se seleccionó ninguna imagen" };
    }

    const formData = new FormData();
    formData.append("imagen", inputFile.files[0] as Blob);

    try {
        const response = await fetch(`${urlBase}/${idProducto}`, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            return { ok: true, mensaje: "Imagen subida correctamente", data };
        } else {
            const errorData = await response.json();
            return { ok: false, mensaje: errorData.error || "Error al subir la imagen" };
        }
    } catch (error) {
        console.error("Error en el upload:", error);
        return { ok: false, mensaje: "Error de conexión al subir la imagen" };
    }
}
