import { redirigirAEditarProducto } from '../producto/editar-producto-view.js';
import { cerrar_sesion } from '../usuario/cerrar_sesion.js';
import { crear_nav_bar } from '../components/crear_nav_bar.js'

import { crear_formulario } from "../components/crear_formulario.js";
import { getFormByID } from '../utils/get-elements-by-util.js';
import { tableDefs } from '../config/estructuras.js';

import {url_editar_producto_view } from '../config/rutas.js';

document.addEventListener('DOMContentLoaded', async () => {

    const form: HTMLFormElement = getFormByID('form_comprar_producto');
    crear_nav_bar();

    crear_formulario_comprar_producto(form);

    redirigirAEditarProducto(url_editar_producto_view);

    cerrar_sesion();
});

function crear_formulario_comprar_producto(form: HTMLFormElement) {
    const submitTexcontent: string = 'Comprar';
    crear_formulario(form,
        tableDefs.find(t => t.name as string === 'compras')!.columns,
        [], submitTexcontent, '');
}
