import { usuarioTableDef } from '../estructuras.js';
import { crear_nav_bar } from '../html-operation/crear_nav_bar.js';
import { getElementByID, getFormByID } from '../html-operation/get.js'
import { setAttrs } from '../html-operation/html_elements.js';
import { formToDict } from '../html-operation/parsers.js';
import { cerrar_sesion } from './cerrar_sesion.js';
import { crear_formulario_prueba } from "./crear_formulario.js";

const id_form = 'loginForm';
const form: HTMLFormElement | null = getFormByID(id_form);
const errorMessage: HTMLElement = getElementByID('errorMessage');



document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();
    cerrar_sesion();
    const submitTextContent = 'Iniciar sesión';
    const clase = 'form-group';
    crear_formulario_prueba(
        form, 
        usuarioTableDef.columns.filter(
            columna => (columna.name === 'username') || (columna.name === 'password')), 
        [link_a_register()], 
        submitTextContent,
        clase);
});

form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = formToDict(form);

    const username = formData['username'];
    const password = formData['password'];

    try {
        const response = await fetch('api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            sessionStorage.setItem('username', data.username);
            const url = sessionStorage.getItem('urlAnterior');
            window.location.href = url ? url : '/';
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


function link_a_register() {
    const link: HTMLElement = document.createElement('a');
    setAttrs(link, { class: 'link', href: '/register', id: 'link-register-login' });
    link.textContent = '¿No tienes una cuenta? Registrate aquí';
    return link
}
