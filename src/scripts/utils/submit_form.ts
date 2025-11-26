import { mostrarNotificacion } from "./mostrar-notificacion.js";
import { formToDict } from "./parsers.js";

export function agregar_evento_submit_form(
    form: HTMLFormElement, 
    urlUsuarios: string, 
    mensajeExito: string, 
    mensajeError: string,
    casoExito: (response: Response, exito: string) => void,
    casoError: (response: Response, error: string) => void
) {
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data: { [key: string]: string; } = formToDict(form);

        try {
            const response = await fetch(urlUsuarios, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }); 

            const responseData = await response.json();

            if (response.ok) {
                mostrarNotificacion(mensajeExito, 'success');
                mostrarNotificacion(responseData.mensaje, 'success');
                casoExito(response, mensajeExito);
            } else {
                mostrarNotificacion(responseData.error || mensajeError, 'error');
                casoError(response, mensajeError);
            }
        } catch (error) {
            mostrarNotificacion('Error de conexión con el servidor', 'error');
        }
    });
}