import { cerrar_sesion } from '../usuario/cerrar_sesion.js';
import { agregar_boton_eliminar_usuario } from '../usuario/eliminar_usuario.js';
import { crear_nav_bar } from '../components/crear_nav_bar.js'
import { url_usuarios } from '../config/rutas.js';
import { tableDefs } from '../config/estructuras.js';
import { crear_formulario } from '../components/crear_formulario.js';
import { getFormByID } from '../utils/get-elements-by-util.js';
import { convertir_a_nullable } from '../utils/convertir_a_opcional_campo_formulario.js';
import { agregar_evento_submit_form } from '../utils/submit_form.js';

document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();

    const tablaUsuarios = convertir_a_nullable(
        tableDefs.find(t => t.name === 'usuarios')!.columns.filter(col => col.name !== 'password'));
    const form_usuario: HTMLFormElement = getFormByID("pedido_de_edicion_usuario");
    crear_formulario(form_usuario,
        tablaUsuarios,
        [],
        'Confirmar Cambios',
        'form-group');
    const url_usuario = url_usuarios + "/" + sessionStorage.getItem('username');

    const mensajeExito_usuario = 'Usuario editado exitosamente';
    const mensajeError_usuario = 'Error al editar el usuario';
    const hacerNada = (_response: Response, _mensajeError: string) => {
        // no hago nada
    };
    agregar_evento_submit_form(form_usuario, url_usuario, "PUT", mensajeExito_usuario, mensajeError_usuario,
        hacerNada, hacerNada
    );

    agregar_boton_eliminar_usuario(url_usuarios);
    cerrar_sesion();
});
