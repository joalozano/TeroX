import { formToDict } from "../utils/parsers.js";
import { mostrarNotificacion } from "../utils/mostrar-notificacion.js";

export function agregarEventoSubmitForm(form: HTMLFormElement, urlUsuarios: string, 
    mensajeExito: string, mensajeError:string) {
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data: { [key: string]: string; } = formToDict(form);

        try {
            const response = await fetch(urlUsuarios, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();

            if (response.ok) {
                mostrarNotificacion(mensajeExito, 'success');
            } else {
                mostrarNotificacion(responseData.error || mensajeError, 'error');
            }
        } catch (error) {
            mostrarNotificacion('Error de conexión con el servidor', 'error');
        }
    });
}
