import { formToDict } from "../utils/parsers.js";
import { subirImagen } from "../utils/subir-imagen.js";
import { mostrarNotificacion } from "../utils/mostrar-notificacion.js";

export function editarProducto(urlProducto: string, urlImagen: string) {
    const form = document.getElementById("form_editar_producto") as HTMLFormElement;
    const inputImagen = document.getElementById("imagen_input") as HTMLInputElement;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const producto_id = form.dataset["id"] as string;

        const data: { [key: string]: string; } = formToDict(form);
        try {
            const response = await fetch(`${urlProducto}/${producto_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                mostrarNotificacion("No se pudo actualizar el producto", "error");
                return;
            }

            if (inputImagen.files && inputImagen.files.length > 0) {
                const resultadoImagen = await subirImagen(urlImagen, parseInt(producto_id), inputImagen, "PUT");

                if (!resultadoImagen.ok) {
                    mostrarNotificacion("Error al actualizar la imagen: " + resultadoImagen.mensaje, "error");
                    return;
                }
            }

            mostrarNotificacion("Producto actualizado correctamente", "success");
            form.reset();

        } catch (err) {
            mostrarNotificacion("Error de conexión", "error");
        }
    });
}
