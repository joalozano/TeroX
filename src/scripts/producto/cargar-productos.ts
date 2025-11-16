import { mostrarNotificacion } from "../html-operation/mostrar-notificacion.js";
import { crear_contenedor_producto_y_agregar_a_lista } from "../html-operation/producto-html.js";

async function cargarProductos(url_productos: string) {
    const lista: HTMLElement = document.getElementById("lista_productos")!;
    const mensajeEstado = document.getElementById("mensaje_estado")!;

    try {
        mensajeEstado.textContent = "Cargando productos...";

        const username = sessionStorage.getItem("username");
        const respuesta = await fetch(`${url_productos}?username=${username}`, {
            method: "GET"
        });

        if (!respuesta.ok){
            mostrarNotificacion("No se pudieron cargar los productos", "error");
        }
        const productos = await respuesta.json();

        if (!productos || productos.length === 0) {
            mensajeEstado.textContent = "No hay productos disponibles :(";
            return;
        }

        mensajeEstado.remove()

        for (const producto of productos) {
            crear_contenedor_producto_y_agregar_a_lista(producto, lista);
        }
    } catch (error) {
        mostrarNotificacion("Error al cargar los productos", "error");
        mensajeEstado.textContent = "Ocurrió un error al cargar los productos.";
    }
}

export { cargarProductos };
