import { crear_nav_bar } from "../components/crear_nav_bar.js";
import { cargarProductos } from "../producto/cargar-productos.js";
import { cerrar_sesion } from "../usuario/cerrar_sesion.js";
import { url_productos } from "../config/rutas.js";
import { agregarEventoRedirigirACompra } from "../producto/agregar-evento-comprar.js";

document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();
    await cargarProductos(url_productos);
    agregarEventoRedirigirACompra();
    cerrar_sesion();
});
