import { cargarProductos } from './producto/cargar-productos.js';
import { borrarProductos } from './producto/borrar-producto.js';
import { agregarProducto } from './producto/agregar-producto.js';
import { redirigirAEditarProducto } from './producto/editar-producto-view.js';
import { cerrar_sesion } from './usuario/cerrar_sesion.js';
import { crear_nav_bar } from './html-operation/crear_nav_bar.js'
import { crear_formulario_prueba } from "./usuario/crear_formulario.js";
import { getFormByID } from './html-operation/get.js';
import { tableDefs } from './estructuras.js';

document.addEventListener('DOMContentLoaded', async () => {
    const url_productos = '/api/productos';
    const url_editar = '/editar_producto';
    const url_imagen = '/uploads';

    const form: HTMLFormElement = getFormByID('form_agregar_producto');

    crear_nav_bar();

    agregarProducto(url_productos, url_imagen);

    await cargarProductos(url_productos);

    crear_formulario_agregar_productos(form);

    borrarProductos(url_productos);
    redirigirAEditarProducto(url_editar);

    cerrar_sesion();
});

function crear_formulario_agregar_productos(form: HTMLFormElement) {
    const submitTexcontent: string = 'Agregar Producto';
    crear_formulario_prueba(form,
        tableDefs.find(t => t.name === 'productos')!.columns.filter(col => col.name !== 'producto_id' && col.name !== 'usuario_id'),
        [], submitTexcontent, '');
}
