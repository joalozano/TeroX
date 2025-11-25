import { subirImagen } from '../utils/subir-imagen.js';
import { formToDict } from '../utils/parsers.js';
import { agregarProductoALista } from '../components/producto-html.js';
import { getElementByID } from '../utils/get-elements-by-util.js';
import { mostrarNotificacion } from '../utils/mostrar-notificacion.js';
import { url_productos } from '../config/rutas.js';

async function agregarProducto(urlProducto: string, urlImagen: string) {
    const form = document.getElementById("form_agregar_producto") as HTMLFormElement;
    const inputImagen = document.getElementById("imagen_input") as HTMLInputElement;
    const lista_productos = getElementByID("lista_productos");

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
            mostrarNotificacion("No se pudo agregar producto", "error");
            return;
        }

        const respData = await resp.json();

        const producto_id = respData.id;

        mostrarNotificacion("Producto creado. Ahora subiendo imagen...", "success");

        const resultadoImagen = await subirImagen(urlImagen, producto_id, inputImagen, "POST");

        mostrarNotificacion(resultadoImagen.mensaje, resultadoImagen.ok ? "success" : "error");

        if (resultadoImagen.ok) {
            form.reset();
            //const url: URL = new URL(urlProducto);
            //url.searchParams.set("producto_id", producto_id);
            const url_nuevo_producto = url_productos + `?producto_id=${producto_id}`;
            const response = await fetch(url_nuevo_producto, {
                method: "GET"
            });

            const producto = (await response.json())[0];
            agregarProductoALista(producto, lista_productos, false);
        }
    });
}

export { agregarProducto };
