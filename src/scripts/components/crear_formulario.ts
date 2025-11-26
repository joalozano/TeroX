import { ColumnDef } from "../config/estructuras";
import { setAttrs } from "../utils/html_elements.js";

//el estilo del fondo se lo da el id del formulario

export function crear_formulario(form: HTMLElement, columnas_usuario: ColumnDef[],
    extras: HTMLElement[], submitTexcontent: string, fieldStyleClass: string) {
    //convertir tableDef en un objeto al que le pueda pedir una tabla en específico
    columnas_usuario.forEach((columna: ColumnDef) => {
        //ahora falta cambiar crearCampo para que acepte ColumnDef
        //si solo uso columna van a faltarme campos que no tienen sentido en columna
        //tendría que agregarle campos que son específicos del front
        //podría ponerlo igual, aunque no forme parte de la estructura de la tabla
        if(!columna.hidden){
            form.appendChild(crearCampo(columna, fieldStyleClass));
        }
    });

    const submit: HTMLElement = document.createElement('button');
    setAttrs(submit, { id: 'boton-principal', type: 'submmit', class: 'btn-login' });
    submit.textContent = submitTexcontent;
    form.appendChild(submit);

    extras.forEach((extra: HTMLElement) => {
        form.appendChild(extra);
    });
}

export function crearCampo(columna: ColumnDef, clase: string) {
    const div = document.createElement('div');
    setAttrs(div, {class : clase});
    
    if(columna.htmlType !== 'hidden'){
        const label = document.createElement('label');
        setAttrs(label, {for : columna.name});
        label.textContent = columna.title!;
        div.appendChild(label);

    }

    const input = document.createElement('input');
    
    if (columna.nullable){
        setAttrs(input, {type : columna.htmlType as string, id : columna.name,  
        name : columna.name, autocomplete: columna.autocomplete as string, 
        placeholder : columna.description as string})    
    }
    else {
        setAttrs(input, {type : columna.htmlType as string, id : columna.name, 
            requiere : columna.nullable, name : columna.name, autocomplete: columna.autocomplete as string, 
            placeholder : columna.description as string})         
    }

    div.appendChild(input);    
    return div;
}
