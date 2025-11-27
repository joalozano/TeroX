import { mostrarNotificacion } from "../utils/mostrar-notificacion.js";
import { agregarListenerAContenedorParaBotones } from "./borrar-producto.js";

function redirigirAEditarProducto(url: string) {
    const mensajeExito = '';
    const mensajeError = 'Error al redirigir a la edición del producto';

    const accionARealizarSobreElem = async (elemID: string, _elemHTML: HTMLElement, 
        _mensajeExito: string, _mensajeError: string, url: string) => {
        if (!elemID){
            mostrarNotificacion(mensajeError, 'error');
        }
        else{
            window.location.href = `${url}?producto_id=${elemID}`;
        }
    };
    agregarListenerAContenedorParaBotones('lista_productos', '.pedido_de_edicion', url, 
        mensajeExito, mensajeError, accionARealizarSobreElem);
}

export { redirigirAEditarProducto };

