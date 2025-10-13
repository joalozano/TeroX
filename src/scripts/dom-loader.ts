import { cargarProductos } from './cargar-productos.js';
import { borrarProductos } from './borrar-producto.js';
import { agregarProducto } from './agregar-producto.js';
//AGREGAR IMPORTS FALLA, TIENE QUE COMPILARSE SI EXPORTS PARA QUE ESTEN EN LA CARPETA
import { cerrar_sesion } from './cerrar_sesion.js';

document.addEventListener('DOMContentLoaded', async () => {
    agregarProducto();
    await cargarProductos();
    borrarProductos();
    cerrar_sesion();
});
