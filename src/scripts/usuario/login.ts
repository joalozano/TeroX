import { generar_formulario, infoCampo } from '../html-operation/generar_formulario.js';
import { getElementByID, getFormByID } from '../html-operation/get.js'
import { formToDict } from '../html-operation/parsers.js';

const form: HTMLFormElement | null = getFormByID('loginForm');
const errorMessage: HTMLElement = getElementByID('errorMessage');


const campos_login: Array<Campo> = [
    infoCampo('username', "text", 'required', "username", "Ingrese su usuario", 'Usuario'),
    infoCampo('password', "password", 'required', "current-password", "Ingrese su contraseña", 'Contraseña'),
]

document.addEventListener('DOMContentLoaded', async () => {
    generar_formulario('loginForm', campos_login);
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
