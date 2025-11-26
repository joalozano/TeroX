import { cerrar_sesion } from '../usuario/cerrar_sesion.js';
import { crear_nav_bar } from '../components/crear_nav_bar.js'
import { url_identidad_fiscal } from '../config/rutas.js';
import { identidadFiscalTableDef } from '../config/estructuras.js';
import { crear_formulario } from '../components/crear_formulario.js';
import { getFormByID} from '../utils/get-elements-by-util.js';
import { agregarEventoSubmitForm } from '../utils/submit_form.js';

document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();
    cerrar_sesion();


    const form_cuil: HTMLFormElement = getFormByID("form_cuil");

    crear_formulario(form_cuil,
        identidadFiscalTableDef.columns,
        [],
        'Guardar CUIL',
        'form-group');

    const mensajeExito_fiscal = 'Identidad fiscal editada exitosamente';
    const mensajeError_fiscal = 'Error al editar la identidad fiscal';

    agregarEventoSubmitForm(form_cuil, url_identidad_fiscal, mensajeExito_fiscal, 
        mensajeError_fiscal);

});
