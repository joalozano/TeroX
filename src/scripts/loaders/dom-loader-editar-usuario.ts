import { cerrar_sesion } from '../usuario/cerrar_sesion.js';
import { crear_nav_bar } from '../components/crear_nav_bar.js'
//import editarUsuario from './usuario/editar-usuario.js';


document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();
    //   const url_usuario = '/api/usuario';
    //editarUsuario(url_usuario);
    cerrar_sesion();
});
