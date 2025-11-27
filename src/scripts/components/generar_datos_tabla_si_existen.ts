import { crear_elemento_con_nombre_attrs_y_textcontent } from './producto-html.js';
import { TableDef } from '../config/estructuras.js';
import { getElementByID } from '../utils/get-elements-by-util.js';


export async function generar_datos_tabla_si_existen(url: string, contenedorDatosID: string,
    titulo: string, tableDef: TableDef) {


    const contenedorDatos = getElementByID(contenedorDatosID);
    const tituloHTML = crear_elemento_con_nombre_attrs_y_textcontent('h2', {}, titulo);
    contenedorDatos.appendChild(tituloHTML);

    try {
        const respuesta = await fetch(url, {
            method: 'GET'
        });
        const filas = (await respuesta.json());

        if (respuesta.ok) {
            if (contenedorDatos) {
                filas.forEach((unaFila: any) =>{
                    tableDef.columns.forEach(columna => {
                        if(!columna.hidden){
                            const p = crear_elemento_con_nombre_attrs_y_textcontent('p', {},
                                `${columna.title}: ${unaFila[columna.name!]}`);
                            contenedorDatos.appendChild(p);}
                    });
                });
                    
            }
        }

        else {
            const no_hay_datos = crear_elemento_con_nombre_attrs_y_textcontent('p', {},
                'No se encontraron datos');
            contenedorDatos.appendChild(no_hay_datos);
        }
    } catch (error) {
        console.error('Error al cargar los datos de identidad fiscal:', error);
    }
}
