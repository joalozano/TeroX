import { subirImagen } from '../html-operation/subir-imagen.js';
import { formToDict } from '../html-operation/parsers.js';
import { crear_contenedor_producto } from './cargar-productos.js';
import { getElementByID } from '../html-operation/get.js';

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
            alert("Error al agregar producto");
            return;
        }


        const respData = await resp.json();

        const producto_id = respData.id;

        alert("Producto creado. Ahora subiendo imagen...");

        //PREGUNTAR PORQUE SE HACE EN DOS PARTES
        const resultadoImagen = await subirImagen(urlImagen, producto_id, inputImagen, "POST");

        alert(resultadoImagen.mensaje);

        if (resultadoImagen.ok) {
            form.reset();
            //GENERALIZAR QUIZAS
            const response = await fetch(`${urlProducto}/${producto_id}`, {
                method: "GET"
            });

            const producto = (await response.json())[0];
            crear_contenedor_producto(producto, lista_productos);
        }
    });
}

export { agregarProducto };
