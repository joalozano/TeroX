import { cargarProductos } from './cargar-productos.js';
import { borrarProductos } from './borrar-producto.js';

document.addEventListener('DOMContentLoaded', async () => {
    await cargarProductos();
    borrarProductos();
});
