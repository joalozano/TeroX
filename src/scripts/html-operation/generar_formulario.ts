import { getElementByID } from "./get.js";
import { setAttrs } from "./html_elements.js";

export function generar_formulario(id_formulario: string, campos: Array<Campo>) {
    const form: HTMLElement = getElementByID(id_formulario);
    //crear función que cree un campo dado info campo y luego lo añado a form
    campos.forEach((campo: Campo) => {
        const clase = 'form-group';
        form.appendChild(crearCampo(campo, clase));
    })

    const submit: HTMLElement = document.createElement('button');
    setAttrs(submit, {id : 'boton-principal', type : 'submmit', class : 'btn-login'});
    
    const link: HTMLElement = document.createElement('a');
    if ("loginForm" === id_formulario) {
	const link_recuperar_cuenta = document.createElement('a');
        link_recuperar_cuenta.textContent = 'Recupere su cuenta';
	setAttrs(link_recuperar_cuenta, {class : 'link', href : '/', id : 'link-recuperacion'});
	form.appendChild(link_recuperar_cuenta);
        submit.textContent = 'Iniciar Sesión';
        setAttrs(link, {class : 'link', href : '/register', id : 'link-register-login'})   
        link.textContent = '¿No tienes una cuenta? Registrate aquí'; 
    }
    else if ("registerForm" === id_formulario) {
        submit.textContent = 'Registrarse';
        setAttrs(link, {class : 'link', href : '/login', id : 'link-register-login'})   
        link.textContent = '¿Ya tienes una cuenta? Inicia sesión aquí';
    }
    form.appendChild(submit);
    form.append(link)
}

export function generar_formulario_plano(id_formulario: string, campos: Array<Campo>){
    const form: HTMLElement = getElementByID(id_formulario);
    //crear función que cree un campo dado info campo y luego lo añado a form
    campos.forEach((campo: Campo) => {
        const clase = 'form-group-plano';
        form.appendChild(crearCampo(campo, clase));
    })
    const submit: HTMLElement = document.createElement('button');
    setAttrs(submit, {id : 'boton-principal', type : 'submmit', class : 'btn-login'});
    submit.textContent = 'Enviar';
    form.appendChild(submit);
}

function crearCampo(campo: Campo, clase: string) {
    const div = document.createElement('div');
    setAttrs(div, {class : clase});
    
    const label = document.createElement('label');
    setAttrs(label, {for : campo.label});
    label.textContent = campo.textContent;

    const input = document.createElement('input');
    setAttrs(input, {type : campo.attr.type, id : campo.label, 
        required : campo.attr.required, name : campo.label, autocomplete: campo.attr.autocomplete, placeholder : campo.attr.placeholder})

    div.appendChild(label);
    div.appendChild(input);    
    return div;
}

export function infoCampo(nombre_campo: string, type: string, required: string, 
    autocomplete: string, placeholder: string, textContent: string) {
    return {
        label: nombre_campo,
        attr: {
            type: type,
            id: nombre_campo,
            name: nombre_campo,
            required: required,
            autocomplete: autocomplete,
            placeholder: placeholder
        },
        textContent : textContent
    };
}
