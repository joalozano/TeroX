import { cargarProductos } from './producto/cargar-productos.js';
import { borrarProductos } from './producto/borrar-producto.js';
import { agregarProducto } from './producto/agregar-producto.js';
import { redirigirAEditarProducto } from './producto/editar-producto-view.js';
import { cerrar_sesion } from './usuario/cerrar_sesion.js';
import { crear_nav_bar } from './html-operation/crear_nav_bar.js'

document.addEventListener('DOMContentLoaded', async () => {
    const url_productos = '/api/productos';
    const url_editar = '/editar_producto';
    const url_imagen = '/uploads';

    crear_nav_bar();
    agregarProducto(url_productos, url_imagen);
    await cargarProductos(url_productos);
    borrarProductos(url_productos);
    redirigirAEditarProducto(url_editar);
    cerrar_sesion();
});
