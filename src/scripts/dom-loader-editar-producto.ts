import { editarProducto } from './editar-producto.js';

import { cerrar_sesion } from './cerrar_sesion.js';
import { crear_nav_bar } from './crear_nav_bar.js'


document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();
    const url_productos = '/api/productos';
    const url_imagen = '/uploads';
    editarProducto(url_productos, url_imagen);
    cerrar_sesion();
});
