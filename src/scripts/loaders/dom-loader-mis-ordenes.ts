import { redirigirAEditarProducto } from '../producto/editar-producto-view.js';
import { cerrar_sesion } from '../usuario/cerrar_sesion.js';
import { crear_nav_bar } from '../components/crear_nav_bar.js'
import { url_ordenes, url_editar_producto_view } from '../config/rutas.js';
import { cargarOrdenes } from '../ordenes/cargar-ordenes.js';

document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();
    cerrar_sesion();
    redirigirAEditarProducto(url_editar_producto_view);

    await cargarOrdenes(url_ordenes);
});

