import { cerrar_sesion } from '../usuario/cerrar_sesion.js';
import { agregar_boton_eliminar_usuario } from '../usuario/eliminar_usuario.js';
import { crear_nav_bar } from '../components/crear_nav_bar.js'
import { url_usuarios } from '../config/rutas.js';
import { tableDefs, usuarioTableDef } from '../config/estructuras.js';
import { crear_formulario } from '../components/crear_formulario.js';
import { getElementByID } from '../utils/get-elements-by-util.js';
import { convertir_a_nullable } from '../utils/convertir_a_opcional_campo_formulario.js';
import { agregar_evento_submit_form } from '../utils/submit_form.js';
import { generar_datos_tabla_si_existen } from '../components/generar_datos_tabla_si_existen.js';

document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();

    const tablaUsuarios = convertir_a_nullable(
        tableDefs.find(t => t.name === 'usuarios')!.columns.filter(col => col.name !== 'password'));

    const url_usuario_actual = `${url_usuarios}?username=${sessionStorage.getItem('username')}`;
    const contenedorID = `datos_${usuarioTableDef.elementName}`;
    generar_datos_tabla_si_existen(
        url_usuario_actual,
        contenedorID,
        'Mis Datos de Usuario',
        usuarioTableDef
    );

    const form_usuario: HTMLFormElement = getElementByID("pedido_de_edicion_usuario") as HTMLFormElement;

    crear_formulario(form_usuario,
        tablaUsuarios,
        [],
        'Guardar Cambios',
        'form-group');

    const mensajeExito_usuario = 'Usuario editado exitosamente';
    const mensajeError_usuario = 'Error al editar el usuario';
    const hacerNada = (_response: Response, _mensajeError: string) => {
        // no hago nada
    };

    const casoExito = (_response: Response, _mensajeError: string) => {
        const contenedor_datos_fiscales = getElementByID(contenedorID)
        contenedor_datos_fiscales.replaceChildren();
        generar_datos_tabla_si_existen(
            url_usuario_actual,
            contenedorID,
            'Mis Datos de Usuario',
            usuarioTableDef
        );
    };

    agregar_evento_submit_form(form_usuario, url_usuario_actual, "PUT", mensajeExito_usuario,
        mensajeError_usuario, casoExito, hacerNada);

    agregar_boton_eliminar_usuario(url_usuarios);
    cerrar_sesion();
});
