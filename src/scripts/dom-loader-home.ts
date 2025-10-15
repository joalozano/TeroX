import { cargarProductos } from './cargar-productos.js';
import { borrarProductos } from './borrar-producto.js';
import { agregarProducto } from './agregar-producto.js';
import { redirigirAEditarProducto } from './editar-producto-view.js';
//AGREGAR IMPORTS FALLA, TIENE QUE COMPILARSE SI EXPORTS PARA QUE ESTEN EN LA CARPETA
import { cerrar_sesion } from './cerrar_sesion.js';
import { crear_nav_bar } from './crear_nav_bar.js'

document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();
    const url_productos = '/api/productos';
    const url_editar = '/editar_producto';
    agregarProducto(url_productos);
    await cargarProductos(url_productos);
    borrarProductos(url_productos);
    redirigirAEditarProducto(url_editar);
    cerrar_sesion();
});
