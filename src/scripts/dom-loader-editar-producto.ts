import { editarProducto } from './producto/editar-producto.js';
import { cerrar_sesion } from './usuario/cerrar_sesion.js';
import { crear_nav_bar } from './html-operation/crear_nav_bar.js'
import { crear_formulario_prueba } from './usuario/crear_formulario.js';
import { getFormByID } from './html-operation/get.js';
import { tableDefs } from './estructuras.js';


document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();
    const url_productos = '/api/productos';
    const url_imagen = '/uploads';
    editarProducto(url_productos, url_imagen);
    const form: HTMLFormElement = getFormByID('form_editar_producto');
    crear_formulario_agregar_productos(form)
    cerrar_sesion();
});

function crear_formulario_agregar_productos(form: HTMLFormElement) {
    const submitTexcontent: string = 'Confirmar Cambios';
    const tablaProductos = tableDefs.find(t => t.name === 'productos')!;
    const columnaProductosEditable =  tablaProductos.columns.map(column => {
        return {
            ...column,
            nullable : true
        }
    })
    //puedo guardarme los campos a autocompletar
    
    crear_formulario_prueba(form,
        columnaProductosEditable.filter(col => col.name !== 'producto_id' && col.name !== 'usuario_id'),
        [], submitTexcontent, '');
}