import { mostrarNotificacion } from "../utils/mostrar-notificacion.js";
import { agregarProductoALista } from "../components/agregar-item-producto-a-lista.js";

async function cargarProductos(url_productos: string, presentacion: string) {
    const mensajeEstado = document.getElementById("mensaje_estado")!;

    try {
        mensajeEstado.textContent = "Cargando productos...";

        const username = sessionStorage.getItem("username");
        let url_final = url_productos;
        
        //si es editable necesito mostrar solo los productos del usuario que inicio sesion
        if(presentacion === 'editable'){
            url_final += `?username=${username}`;
        }
        
        const respuesta = await fetch(url_final, {
            method: "GET"
        });

        if (!respuesta.ok) {
            mostrarNotificacion("No se pudieron cargar los productos", "error");
            mensajeEstado.textContent = "Ocurrió un error al cargar los productos.";
            return;
        }
        const productos = await respuesta.json();

        if (!productos || productos.length === 0) {
            mensajeEstado.textContent = "No hay productos disponibles :(";
            return;
        }

        productos.sort((a: any, b: any) => b.rating - a.rating);

        const lista: HTMLElement = document.getElementById("lista_productos")!;
        lista.replaceChildren();
        mensajeEstado.textContent = "";
        for (const producto of productos) {
            agregarProductoALista(producto, lista, presentacion);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        }
        mostrarNotificacion("No se pudo cargar los productos", "error");
        mensajeEstado.textContent = "Ocurrió un error al cargar los productos.";
    }
}

export { cargarProductos };
