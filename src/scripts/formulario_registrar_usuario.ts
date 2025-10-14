import { getElementByID } from "./html-operation/get";

interface Campo {
    campo: string;
    attr: {
        type: string;
        id: string;
        name: string;
        required: boolean;
        autocomplete: string;
        placeholder: string;
    }
}

const campos: Array<Campo> = [
    infoCampo('username', "text", true, "username", "Ingrese su usuario"),
    infoCampo('password', "password", true, "current-password", "Ingrese su contraseña"),
    infoCampo('name', "name", true, "curren-name", "Ingrese su nombre real"),
]

export function generar_formulario_registrar_usuario() {
    const form: HTMLElement = getElementByID('registerForm');
    //crear función que cree un campo dado info campo y luego lo añado a form
    campos.forEach((campo: Campo) => {
        form.appendChild(crearCampo(campo))
    })

    const submit: HTMLElement = document.createElement('button');
    form.appendChild(submit);
}

function crearCampo(_: Campo) {
    return document.createElement('label');
}

function infoCampo(nombre_campo: string, type: string, required: boolean, autocomplete: string, placeholder: string) {
    return {
        campo: nombre_campo,
        attr: {
            type: type,
            id: nombre_campo,
            name: nombre_campo,
            required: required,
            autocomplete: autocomplete,
            placeholder: placeholder
        }
    };
}
