import { subirImagen } from "./subir-imagen.js";
import { formToDict } from './html-operation/parsers.js';

async function agregarProducto(urlProducto: string, urlImagen: string) {
    const form = document.getElementById("form_agregar_producto") as HTMLFormElement;
    const inputImagen = document.getElementById("imagen_input") as HTMLInputElement;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const jsonData = JSON.stringify(formToDict(form));

        const resp = await fetch(urlProducto, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        });

        if (!resp.ok) {
            alert("Error al agregar producto");
            return;
        }

        const respData = await resp.json();
        const idProducto = respData.id;

        alert("Producto creado. Ahora subiendo imagen...");

        const resultadoImagen = await subirImagen(urlImagen, idProducto, inputImagen);

        alert(resultadoImagen.mensaje);

        if (resultadoImagen.ok) form.reset();
    });
}

export { agregarProducto };
