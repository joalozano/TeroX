import { getElementByID, getFormByID } from '../html-operation/get'
import { formToDict } from '../html-operation/parsers';

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
            errorMessage.textContent = data.error || 'Error al iniciar sesión';
            errorMessage.classList.add('show');
        }
    } catch (error) {
        errorMessage.textContent = 'Error de conexión con el servidor';
        console.log("Error: ", error);
        errorMessage.classList.add('show');
    }
});

getElementByID('username').addEventListener('input', () => {
    errorMessage.classList.remove('show');
});
getElementByID('password').addEventListener('input', () => {
    errorMessage.classList.remove('show');
});
