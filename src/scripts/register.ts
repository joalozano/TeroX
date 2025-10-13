import {getElementByID, getElementsByClass, getFormByID} from './html-operation/get.js'
import { formToDict } from './html-operation/parsers.js';
import { setAttrs } from './html-operation/html_elements.js';

const form: HTMLFormElement | null = getFormByID('registerForm');
const errorMessage: HTMLElement = getElementByID('errorMessage');

form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = formToDict(form);
    
    try {   
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok) {
            //mostrar que el registro funcionó y poner un boton para iniciar sesion
            //tengo que seleccionar los div por clase y eliminarlos a todos
            const form_groups = getElementsByClass("form-group");
            Array.from(form_groups).forEach((form_group: HTMLElement) =>{
                form_group.remove();
            });

            console.log("SE BORRARON LOS CAMPOS PARA REGISTRARSE")

            //tengo que agregar un boton para ir a inicio de sesion
            //mejor modifico el que ya tenía
            const boton_principal = getElementByID("boton-principal");
            //tengo que cambiar el tipo del boton y el texto
            const boton_nuevo = document.createElement("button");
            setAttrs(boton_nuevo, {type: "button", class: "btn-login"});

            const link_login: HTMLElement = document.createElement("a");
            setAttrs(link_login, {class: "link", href: "/login"});
            link_login.textContent= 'Login existoso, puede iniciar sesión';
            boton_nuevo.appendChild(link_login);
            boton_principal.replaceWith(boton_nuevo);
    
        } else {
            // Mostrar error
            errorMessage.textContent = data.error || 'Error al iniciar sesión';
            errorMessage.classList.add('show');
        }
    } catch (error) {
        errorMessage.textContent = 'Error de conexión con el servidor';
        console.log("Error: ", error);
        errorMessage.classList.add('show');
    }
});

// Ocultar mensaje de error al escribir
getElementByID('username').addEventListener('input', () => {
    errorMessage.classList.remove('show');
});
getElementByID('password').addEventListener('input', () => {
    errorMessage.classList.remove('show');
});