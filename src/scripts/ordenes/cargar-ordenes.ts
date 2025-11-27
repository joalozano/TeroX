import { mostrarNotificacion } from "../utils/mostrar-notificacion.js";
import { agregarOrdenALista } from "../components/agregar-item-orden-a-lista.js";

async function cargarOrdenes(url_ordenes: string) {
    const mensajeEstadoComprasElemento = document.getElementById("mensaje_estado_compras")!;
    const mensajeEstadoVentasElemento = document.getElementById("mensaje_estado_ventas")!;

    const mensajeEstadoCompras = "Aún no has comprado ningun producto.";
    const mensajeEstadoVentas = "Aún no has vendido ningun producto.";

    try {
        const username = sessionStorage.getItem("username");
        const respuesta = await fetch(`${url_ordenes}?username=${username}`, {
            method: "GET"
        });

        if (!respuesta.ok) {
            mostrarNotificacion("No se pudieron cargar las ordenes", "error");
            return;
        }
        const ordenes = await respuesta.json();

        if (!ordenes) {
            mensajeEstadoComprasElemento.textContent = mensajeEstadoCompras;
            mensajeEstadoVentasElemento.textContent = mensajeEstadoVentas;
            return;
        }

        if (ordenes[0].length === 0) {
            mensajeEstadoComprasElemento.textContent = mensajeEstadoCompras;
        } else {

            const lista_ordenes_compra: HTMLElement = document.getElementById("lista_ordenes_compras")!;
            mensajeEstadoComprasElemento.remove();
            for (const orden of ordenes[0]) {
                agregarOrdenALista(orden, lista_ordenes_compra);
            }
        }
        if (ordenes[1].length === 0) {
            mensajeEstadoVentasElemento.textContent = mensajeEstadoVentas;
        } else {
            const lista_ordenes_venta: HTMLElement = document.getElementById("lista_ordenes_ventas")!;
            for (const orden of ordenes[1]) {
                agregarOrdenALista(orden, lista_ordenes_venta);
            }

            mensajeEstadoVentasElemento.remove();
        }
    } catch (error) {
        if (error instanceof Error) {
            alert(`Error: ${error.message}`);
        }
        mostrarNotificacion("No se pudo cargar los ordenes", "error");
        mensajeEstadoComprasElemento.textContent = "Ocurrió un error al cargar los ordenes.";
        mensajeEstadoVentasElemento.textContent = "Ocurrió un error al cargar los ordenes.";
    }
}

export { cargarOrdenes };
