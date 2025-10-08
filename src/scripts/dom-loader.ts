import { cargarProductos } from './cargar-productos.js';
import { borrarProductos } from './borrar-producto.js';
import { agregarProducto } from './agregar-producto.js';

document.addEventListener('DOMContentLoaded', async () => {
    agregarProducto();
    await cargarProductos();
    borrarProductos();
});
