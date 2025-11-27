import { redirigirAEditarProducto } from '../producto/editar-producto-view.js';
import { cerrar_sesion } from '../usuario/cerrar_sesion.js';
import { crear_nav_bar } from '../components/crear_nav_bar.js'
import { crear_formulario } from "../components/crear_formulario.js";
import { getElementByID, getFormByID, getInputElementById } from '../utils/get-elements-by-util.js';
import { productoTableDef, compra_formulario } from '../config/estructuras.js';
import { url_editar_producto_view, url_ordenes, url_productos } from '../config/rutas.js';
import { agregarProductoALista } from '../components/agregar-item-producto-a-lista.js';
import { mostrarNotificacion } from '../utils/mostrar-notificacion.js';
import { agregar_evento_submit_form } from '../utils/submit_form.js';

document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();

    const form: HTMLFormElement = getFormByID('form_comprar_producto');
    crear_formulario_comprar_producto(form);

    const producto_id_input: HTMLInputElement = getInputElementById('producto_id');
    const id_producto_a_vender = form.dataset['id'] as string;

    //tengo que generar el html para que se muestre el producto, estaría bueno usar la función que 
    //se usar para el cargar los productos

    const url_producto_a_comprar: string =
        url_productos + `?${productoTableDef.pk![0]}=${id_producto_a_vender}`;


    const respuesta = await fetch(url_producto_a_comprar, {
        method: "GET"
    });
    if (!respuesta.ok) {
        mostrarNotificacion("No se pudieron cargar los productos", "error");
    }

    const producto = (await respuesta.json())[0];
    const contenedor_produto: HTMLElement =
        getElementByID(`datos_${productoTableDef.elementName}`);

    agregarProductoALista(producto, contenedor_produto, 'ver')

    producto_id_input.value = id_producto_a_vender;

    const mensajeExito = 'Producto comprado exitosamente';
    const mensajeError = 'Error al comprar el producto, no hay mensaje específico';

    const hacerNada = (_response: Response, _mensajeError: string) => { };

    //el formulario hace POST a url_ordenes
    agregar_evento_submit_form(form, url_ordenes, "POST", mensajeExito,
        mensajeError, hacerNada, hacerNada);

    redirigirAEditarProducto(url_editar_producto_view);

    cerrar_sesion();
});

function crear_formulario_comprar_producto(form: HTMLFormElement) {
    const submitTexcontent: string = 'Comprar';
    crear_formulario(form,
        compra_formulario.columns,
        [], submitTexcontent, '');
}
