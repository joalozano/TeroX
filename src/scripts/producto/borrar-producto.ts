import { getElementByID } from "../utils/get-elements-by-util.js";
import { mostrarNotificacion } from "../utils/mostrar-notificacion.js";

async function borrarProductos(url: string) {
    const contenedorAEscuchar = 'lista_productos';
    const claseDeBotonObjetivo = '.pedido_de_borrado';
    const accionARealizarSobreElem: (elemID: string, elemHTML: HTMLElement, mensajeExito: string, mensajeError: string, url: string) => Promise<void> = 
        async (elemID: string, elemHTML: HTMLElement, mensajeExito: string, mensajeError: string, url: string) => {
            const response = await fetch(`${url}/${elemID}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                elemHTML.remove();
                mostrarNotificacion(mensajeExito, 'success'); 
            } 
            else {
                const respuesta = await response.json();
                mostrarNotificacion(respuesta.error || mensajeError, 'error');
            }
    }
    const mensajeExito = 'Producto borrado correctamente';
    const mensajeError = 'Error al borrar producto';
    agregarListenerAContenedorParaBotones(contenedorAEscuchar, claseDeBotonObjetivo, 
        url, mensajeExito, mensajeError, accionARealizarSobreElem);
    
}

export async function agregarListenerAContenedorParaBotones(contenedorAEscuchar:string, 
    claseDeBotonObjetivo: string, url: string, mensajeExito: string, mensajeError: string,
    accionARealizarSobreElem: (elemID: string, elemHTML: HTMLElement, mensajeExito: string, mensajeError: string, url: string) => Promise<void>) {
    const contenedorProductos = getElementByID(contenedorAEscuchar);

    if (!contenedorProductos) return;

    contenedorProductos.addEventListener('click', async (event) => {
        const target = event.target as HTMLElement;

        
        const button = target.closest(claseDeBotonObjetivo) as HTMLButtonElement;

        if (!button) return;

        event.preventDefault();

        const producto_id = button.dataset["id"];

        const productoElement = button.closest('li');

        if (!productoElement) {
            mostrarNotificacion('No se pudo encontrar el elemento del producto', 'error');
            return;
        }

        try {
            button.disabled = true;
            accionARealizarSobreElem(producto_id!, productoElement, mensajeExito, mensajeError, url);
        
            
        } catch (error) {
            button.disabled = false;
            mostrarNotificacion('Error de conexión', 'error');
            console.error(error);
        }
        button.disabled = false;
    });
    
}


export { borrarProductos };
