import { cargarProductos } from './cargar-productos.js';
import { borrarProductos } from './borrar-producto.js';
import { agregarProducto } from './agregar-producto.js';

document.addEventListener('DOMContentLoaded', async () => {
    const url_productos = '/api/productos';
    agregarProducto(url_productos);
    await cargarProductos(url_productos);
    borrarProductos(url_productos);
});
