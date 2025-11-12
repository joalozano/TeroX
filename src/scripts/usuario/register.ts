import { getElementByID, getElementsByClass, getFormByID } from '../html-operation/get.js'
import { formToDict } from '../html-operation/parsers.js';
import { setAttrs } from '../html-operation/html_elements.js';
import { generar_formulario } from '../html-operation/generar_formulario.js';
import { infoCampo } from '../html-operation/generar_formulario.js';
import { crear_nav_bar } from '../html-operation/crear_nav_bar.js';


const campos_register: Array<Campo> = [
    infoCampo('username', "text", 'required', "username", "Ingrese su usuario", 'Usuario'),
    infoCampo('password', "password", 'required', "current-password", "Ingrese su contraseña", 'Contraseña'),
    infoCampo('email', 'email', 'required', 'current-email', 'Ingrese su email', 'Email'),
    infoCampo('nombre', 'name', 'required', "current-name", "Ingrese su nombre real", 'Nombre'),
]

const form: HTMLFormElement | null = getFormByID('registerForm');
const errorMessage: HTMLElement = getElementByID('errorMessage');

document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();
    generar_formulario('registerForm', campos_register);
});

//usado en register para enviar formulario y actualizar pagina en caso de exito
form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = formToDict(form);

    try {
        const response = await fetch('api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok) {
            eliminar_campos_de_registro();

            crear_boton_ir_a_login();
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

function crear_boton_ir_a_login() {
    const boton_principal = getElementByID("boton-principal");

    const boton_nuevo = document.createElement("button");
    setAttrs(boton_nuevo, { type: "button", class: "btn-login" });

    const link_login: HTMLElement = document.createElement("a");
    setAttrs(link_login, { class: "link", href: "/login" });
    link_login.textContent = 'Registro existoso, puede iniciar sesión';
    boton_nuevo.appendChild(link_login);
    boton_principal.replaceWith(boton_nuevo);
}

function eliminar_campos_de_registro() {
    //hago un forEach porque getElementsByClass devuelve un HTMLCollection
    //y no un solo HTMLElement. Podría cambiar la clase de los form-groups a un ID pero bueno... 
    const form_groups = getElementsByClass("form-group");
    Array.from(form_groups).forEach((form_group: HTMLElement) => {
        form_group.remove();
    });

    const link_registro = getElementByID('link-register-login');
    link_registro.remove();
}