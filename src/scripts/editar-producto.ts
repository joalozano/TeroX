import { formToDict } from "./html-operation/parsers.js";
import { subirImagen } from "./subir-imagen.js";

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
                alert("Error al actualizar el producto");
                return;
            }

            if (inputImagen.files && inputImagen.files.length > 0) {
                const resultadoImagen = await subirImagen(urlImagen, parseInt(producto_id), inputImagen, "PUT");

                if (!resultadoImagen.ok) {
                    alert("Producto actualizado, pero hubo un error al actualizar la imagen: " + resultadoImagen.mensaje);
                    return;
                }
            }

            alert("Producto actualizado correctamente");
            form.reset();

        } catch (err) {
            console.error(err);
            alert("Error al editar el producto");
        }
    });
}
