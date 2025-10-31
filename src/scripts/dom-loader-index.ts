import { crear_nav_bar } from "./html-operation/crear_nav_bar.js";
import { cargarProductos } from "./producto/cargar-productos.js";
import { cerrar_sesion } from "./usuario/cerrar_sesion.js";

document.addEventListener('DOMContentLoaded', async () => {
    const url_productos = '/api/productos';
    
    crear_nav_bar();
    await cargarProductos(url_productos);
    cerrar_sesion();
});
