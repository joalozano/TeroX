import { cerrar_sesion } from '../usuario/cerrar_sesion.js';
import { agregar_boton_eliminar_usuario } from '../usuario/eliminar_usuario.js';
import { crear_nav_bar } from '../components/crear_nav_bar.js'
import { url_usuarios } from '../config/rutas.js';
import { identidadFiscalTableDef, tableDefs } from '../config/estructuras.js';
import { crear_formulario } from '../components/crear_formulario.js';
import { getFormByID } from '../utils/get-elements-by-util.js';
import {convertir_a_nullable} from '../utils/convertir_a_opcional_campo_formulario.js';
import { agregarEventoEditarUsuario } from '../usuario/editar-usuario.js';

document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();

    const tablaUsuarios = convertir_a_nullable(tableDefs.find(t => t.name === 'usuarios')!.columns.filter(
        col => col.name !== 'password'));
    const form_usuario: HTMLFormElement = getFormByID("pedido_de_edicion_usuario");

    crear_formulario(form_usuario,
        tablaUsuarios,
        [],
        'Confirmar Cambios',
        'form-group');
    const url = url_usuarios +"/"+sessionStorage.getItem('username');
    agregarEventoEditarUsuario(form_usuario, url);

    const form_cuil: HTMLFormElement = getFormByID("form_cuil");
    crear_formulario(form_cuil,
        identidadFiscalTableDef.columns,
        [],
        'Guardar CUIL',
        'form-group');
    //agregarEventoCrearCuil(form_cuil, url);

    agregar_boton_eliminar_usuario(url_usuarios);
    cerrar_sesion();
});
