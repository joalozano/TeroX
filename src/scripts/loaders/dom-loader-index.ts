import { crear_nav_bar } from "../components/crear_nav_bar.js";
import { cargarProductos } from "../producto/cargar-productos.js";
import { cerrar_sesion } from "../usuario/cerrar_sesion.js";
import { url_productos } from "../config/rutas.js";
import { agregarEventoRedirigirACompra } from "../producto/agregar-evento-comprar.js";
import { agregarEventoBusqueda } from "../producto/agregar-evento-busqueda.js";

document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();

    const respuesta = await fetch(url_productos, {
        method: "GET"
    });

    const compra_habilitada = 'compra';
    await cargarProductos(respuesta, compra_habilitada);

    agregarEventoBusqueda();
    agregarEventoRedirigirACompra();
    cerrar_sesion();
});
