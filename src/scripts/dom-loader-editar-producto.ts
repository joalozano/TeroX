import { editarProducto } from './producto/editar-producto';

import { cerrar_sesion } from './usuario/cerrar_sesion';
import { crear_nav_bar } from './html-operation/crear_nav_bar'


document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();
    const url_productos = '/api/productos';
    const url_imagen = '/uploads';
    editarProducto(url_productos, url_imagen);
    cerrar_sesion();
});
