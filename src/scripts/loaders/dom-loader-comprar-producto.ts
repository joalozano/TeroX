import { redirigirAEditarProducto } from './producto/editar-producto-view.js';
import { cerrar_sesion } from './usuario/cerrar_sesion.js';
import { crear_nav_bar } from './html-operation/crear_nav_bar.js'

import { crear_formulario } from "./html-operation/crear_formulario.js";
import { getFormByID } from './html-operation/get.js';
import { tableDefs } from './estructuras.js';

import {url_editar_producto_view } from './rutas.js';

document.addEventListener('DOMContentLoaded', async () => {

    const form: HTMLFormElement = getFormByID('form_comprar_producto');
    const oa: Boolean = true;
    crear_nav_bar();
    
    console.log("NAV BAR CREADA");

    crear_formulario_comprar_producto(form);

    redirigirAEditarProducto(url_editar_producto_view);

    cerrar_sesion();
});

function crear_formulario_comprar_producto(form: HTMLFormElement) {
    const submitTexcontent: string = 'Comprar';
    crear_formulario(form,
        tableDefs.find(t => t.name === 'compras')!.columns,
        [], submitTexcontent, '');
}
