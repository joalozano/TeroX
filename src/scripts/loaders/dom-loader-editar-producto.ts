import { editarProducto } from '../producto/editar-producto.js';
import { cerrar_sesion } from '../usuario/cerrar_sesion.js';
import { crear_nav_bar } from '../components/crear_nav_bar.js'
import { crear_formulario } from '../components/crear_formulario.js';
import { getFormByID } from '../utils/get-elements-by-util.js';
import { tableDefs } from '../config/estructuras.js';
import {convertir_a_nullable} from '../utils/convertir_a_opcional_campo_formulario.js';
import { url_productos, url_imagen } from '../config/rutas.js';

document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();
    editarProducto(url_productos, url_imagen);
    const form: HTMLFormElement = getFormByID('form_editar_producto');
    crear_formulario_agregar_productos(form)
    cerrar_sesion();
});

function crear_formulario_agregar_productos(form: HTMLFormElement) {
    const submitTexcontent: string = 'Confirmar Cambios';
    const tablaProductos = tableDefs.find(t => t.name === 'productos')!;
    //es para que permita enviar el formulario con campos vacios
    const columnaProductosEditable =  convertir_a_nullable(tablaProductos.columns)

    crear_formulario(form,
        columnaProductosEditable.filter(col => col.name !== 'producto_id' && col.name !== 'usuario_id'),
        [], submitTexcontent, '');
}

