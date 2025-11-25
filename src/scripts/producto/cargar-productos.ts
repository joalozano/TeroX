import { mostrarNotificacion } from "../utils/mostrar-notificacion.js";
import { agregarProductoALista } from "../components/producto-html.js";

async function cargarProductos(url_productos: string, compra: boolean) {
    const lista: HTMLElement = document.getElementById("lista_productos")!;
    const mensajeEstado = document.getElementById("mensaje_estado")!;

    try {
        mensajeEstado.textContent = "Cargando productos...";

        const username = sessionStorage.getItem("username");
        let url_final = url_productos;
        
        if(!compra){
            url_final += `?username=${username}`;
        }
        
        const respuesta = await fetch(url_final, {
            method: "GET"
        });

        if (!respuesta.ok) {
            mostrarNotificacion("No se pudieron cargar los productos", "error");
        }
        const productos = await respuesta.json();

        if (!productos || productos.length === 0) {
            mensajeEstado.textContent = "No hay productos disponibles :(";
            return;
        }

        mensajeEstado.remove()
        for (const producto of productos) {
            agregarProductoALista(producto, lista, compra);
        }
    } catch (error) {
        if (error instanceof Error) {
            alert(`Error: ${error.message}`);
        }
        mostrarNotificacion("No se pudo cargar los productos", "error");
        mensajeEstado.textContent = "Ocurrió un error al cargar los productos.";
    }
}

export { cargarProductos };
