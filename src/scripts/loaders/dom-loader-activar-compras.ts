import { cerrar_sesion } from '../usuario/cerrar_sesion.js';
import { crear_nav_bar } from '../components/crear_nav_bar.js'
import { url_identidad_fiscal } from '../config/rutas.js';
import { identidadFiscalTableDef } from '../config/estructuras.js';
import { crear_formulario } from '../components/crear_formulario.js';
import { getElementByID, getFormByID } from '../utils/get-elements-by-util.js';
import { agregar_evento_submit_form } from '../utils/submit_form.js';
import { crear_elemento_con_nombre_attrs_y_textcontent } from '../components/crear-elemento.js';

document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();
    cerrar_sesion();

    //para empezar muestro los datos de identidad fiscal antesl fomulario
    generar_datos_identidad_fiscal_si_existen();

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
        generar_datos_identidad_fiscal_si_existen();
    }

    const casoError = (_response: Response, _mensajeError: string) => {
        // no hago nada
    };

    agregar_evento_submit_form(form_cuil, url_identidad_fiscal, "POST", mensajeExito_fiscal,
        mensajeError_fiscal, caso_exito, casoError);
});

async function generar_datos_identidad_fiscal_si_existen() {
    const url = '/api/identidad_fiscal/';

    const contenedorDatos = getElementByID('datos_identidad_fiscal');
    const titulo = crear_elemento_con_nombre_attrs_y_textcontent('h2', {}, 'Identidad Fiscal');
    contenedorDatos.appendChild(titulo);

    try {
        const respuesta = await fetch(url, {
            method: 'GET'
        });
        const { success, data } = await respuesta.json();

        if (success) {

            if (contenedorDatos) {
                identidadFiscalTableDef.columns.forEach(columna => {
                    console.log(columna.name, columna.title, data);
                    const p = crear_elemento_con_nombre_attrs_y_textcontent('p', {},
                        `${columna.title}: ${data[columna.name!]}`);
                    contenedorDatos.appendChild(p)
                });
            }
        }

        else {
            const no_hay_datos = crear_elemento_con_nombre_attrs_y_textcontent('p', {},
                'No se encontraron datos de identidad fiscal. Ingrese para realizar compras en la aplicación');
            contenedorDatos.appendChild(no_hay_datos);
        }
    } catch (error) {
        console.error('Error al cargar los datos de identidad fiscal:', error);
    }
}

