import { cerrar_sesion } from '../usuario/cerrar_sesion.js';
import { agregar_boton_eliminar_usuario } from '../usuario/eliminar_usuario.js';
//import { agregar_formulario_editar_usuario } from '../usuario/editar_usuario.js';
import { crear_nav_bar } from '../components/crear_nav_bar.js'
import { url_usuarios } from '../config/rutas.js';

document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();
    //agregar_formulario_editar_usuario();
    agregar_boton_eliminar_usuario(url_usuarios);
    cerrar_sesion();
});
