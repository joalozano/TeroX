import { getElementByID, getFormByID } from './html-operation/get.js'
import { formToDict } from './html-operation/parsers.js';
const form: HTMLFormElement | null = getFormByID('loginForm');
const errorMessage: HTMLElement = getElementByID('errorMessage');

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
            window.location.href = '/productos';
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
