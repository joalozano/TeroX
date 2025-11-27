import { cerrar_sesion } from '../usuario/cerrar_sesion.js';
import { crear_nav_bar } from '../components/crear_nav_bar.js'
import { url_identidad_fiscal } from '../config/rutas.js';
import { identidadFiscalTableDef } from '../config/estructuras.js';
import { crear_formulario } from '../components/crear_formulario.js';
import { getElementByID, getFormByID } from '../utils/get-elements-by-util.js';
import { agregar_evento_submit_form } from '../utils/submit_form.js';
import { generar_datos_tabla_si_existen } from '../components/generar_datos_tabla_si_existen.js';

document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();
    cerrar_sesion();

    //para empezar muestro los datos de identidad fiscal antesl fomulario
    const titulo = 'Identidad Fiscal';
    await generar_datos_tabla_si_existen(
        url_identidad_fiscal,
        'datos_identidad_fiscal',
        titulo,
        identidadFiscalTableDef
    );

    const form_cuil: HTMLFormElement = getFormByID("form_cuil");

    crear_formulario(form_cuil,
        identidadFiscalTableDef.columns,
        [],
        'Guardar CUIL',
        'form-group');

    const mensajeExito_fiscal = 'Identidad fiscal editada exitosamente';
    const mensajeError_fiscal = 'Error al editar la identidad fiscal';

    const caso_exito = (_response: Response, _data: string) => {
        //tengo que recargar todos los datos y ponerlos en el dom
        //tengo que borrar lo que había antes...
        //debería usar lo que me llega de la base de datos
        const contenedor_datos_fiscales = getElementByID('datos_identidad_fiscal')
        contenedor_datos_fiscales.replaceChildren();
        generar_datos_tabla_si_existen(
            url_identidad_fiscal,
            'datos_identidad_fiscal',
            titulo,
            identidadFiscalTableDef
        );
    }

    const casoError = (_response: Response, _mensajeError: string) => {
        // no hago nada
    };

    agregar_evento_submit_form(form_cuil, url_identidad_fiscal, "POST", mensajeExito_fiscal,
        mensajeError_fiscal, caso_exito, casoError);
});
