import { getElementByID } from "../html-operation/get.js";
import { mostrarNotificacion } from "../html-operation/mostrar-notificacion.js";

async function borrarProductos(url: string) {
    const contenedorProductos = getElementByID('lista_productos');

    if (!contenedorProductos) return;

    contenedorProductos.addEventListener('click', async (event) => {
        const target = event.target as HTMLElement;

        const button = target.closest('.pedido_de_borrado') as HTMLButtonElement;
        if (!button) return;

        event.preventDefault();

        const producto_id = button.dataset["id"];

        const productoElement = button.closest('li');

        if (!productoElement) {
            mostrarNotificacion('No se pudo encontrar el elemento del producto', 'error');
            return;
        }

        try {
            productoElement.style.opacity = '0.5';
            button.disabled = true;

            const response = await fetch(`${url}/${producto_id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                productoElement.style.transition = 'all 0.3s ease';
                productoElement.style.transform = 'translateX(-100%)';
                productoElement.style.opacity = '0';

                setTimeout(() => {
                    productoElement.remove();
                    mostrarNotificacion('Producto borrado correctamente', 'success');
                }, 300);

            } else {
                const respuesta = await response.json();
                productoElement.style.opacity = '1';
                button.disabled = false;
                mostrarNotificacion(respuesta.error || 'Error al borrar producto', 'error');
            }
        } catch (error) {
            productoElement.style.opacity = '1';
            button.disabled = false;
            mostrarNotificacion('Error de conexión', 'error');
            console.error(error);
        }
    });
}

export { borrarProductos };
