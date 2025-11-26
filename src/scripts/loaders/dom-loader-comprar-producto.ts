import { redirigirAEditarProducto } from '../producto/editar-producto-view.js';
import { cerrar_sesion } from '../usuario/cerrar_sesion.js';
import { crear_nav_bar } from '../components/crear_nav_bar.js'

import { crear_formulario } from "../components/crear_formulario.js";
import { getFormByID, getInputElementById } from '../utils/get-elements-by-util.js';
import { tableDefs } from '../config/estructuras.js';

import { url_editar_producto_view } from '../config/rutas.js';
import { agregar_evento_submit_form } from '../utils/submit_form.js';

document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();

    const form: HTMLFormElement = getFormByID('form_comprar_producto');
    crear_formulario_comprar_producto(form);

    //definir campos incompletos

    const producto_id_input: HTMLInputElement = getInputElementById('producto_id');
    producto_id_input.value = form.dataset['id'] as string;
    console.log("PRODUCTO: ", producto_id_input);

    const url_orden = '/api/orden';
    const mensajeExito = 'Producto comprado exitosamente';
    const mensajeError = 'Error al comprar el producto';
    const hacerNada = (_response: Response, _mensajeError: string) => { };
    agregar_evento_submit_form(form, url_orden, "POST", mensajeExito,
        mensajeError, hacerNada, hacerNada);

    redirigirAEditarProducto(url_editar_producto_view);

    cerrar_sesion();
});

function crear_formulario_comprar_producto(form: HTMLFormElement) {
    const submitTexcontent: string = 'Comprar';
    crear_formulario(form,
        tableDefs.find(t => t.name as string === 'compra_formulario')!.columns,
        [], submitTexcontent, '');
}
