import { cargarProductos } from '../producto/cargar-productos.js';
import { borrarProductos } from '../producto/borrar-producto.js';
import { agregarProducto } from '../producto/agregar-producto.js';
import { redirigirAEditarProducto } from '../producto/editar-producto-view.js';
import { cerrar_sesion } from '../usuario/cerrar_sesion.js';
import { crear_nav_bar } from '../components/crear_nav_bar.js'

import { crear_formulario } from "../components/crear_formulario.js";
import { getFormByID } from '../utils/get-elements-by-util.js';
import { tableDefs } from '../config/estructuras.js';

import { url_productos, url_imagen, url_editar_producto_view } from '../config/rutas.js';

document.addEventListener('DOMContentLoaded', async () => {

    const form: HTMLFormElement = getFormByID('form_agregar_producto');

    crear_nav_bar();

    agregarProducto(url_productos, url_imagen);

    const username = sessionStorage.getItem('username') as string;
    const url_final = url_productos + `?username=${username}`;
    const respuesta = await fetch(url_final, {
        method: "GET"
    });

    const edicion_habilitada = 'editable';
    await cargarProductos(respuesta, edicion_habilitada);

    crear_formulario_agregar_productos(form);

    borrarProductos(url_productos);
    redirigirAEditarProducto(url_editar_producto_view);
    
    cerrar_sesion();
});

function crear_formulario_agregar_productos(form: HTMLFormElement) {
    const submitTexcontent: string = 'Agregar Producto';
    crear_formulario(form,
        tableDefs.find(t => t.name === 'productos')!.columns.filter(col => col.name !== 'producto_id' && col.name !== 'usuario_id'),
        [], submitTexcontent, '');
}
