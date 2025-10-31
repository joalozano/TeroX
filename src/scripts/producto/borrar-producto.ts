import { getElementByID } from "../html-operation/get.js";

async function borrarProductos(url: string) {
    // Usar event delegation en el contenedor de todos los productos
    const contenedorProductos = getElementByID('lista_productos');
    
    if (!contenedorProductos) return;

    //voy a escuchar cualquier click y luego veo si es uno sobre un boton de borrado
    contenedorProductos.addEventListener('click', async (event) => {
        //el click es sobre todo el contenedor, acá selecciono el HTMLElement donde se hizo click en específico
        const target = event.target as HTMLElement;

        //si el elemento sobre el que fue el click no tiene como padre un boton de borrado, salgo
        const button = target.closest('.pedido_de_borrado') as HTMLButtonElement;
        if (!button) return;

        event.preventDefault();

        //en este punto ya sé que el click fue sobre o "adentro" un boton de borrado
        const producto_id = button.dataset["id"];
        
        // Encontrar el elemento producto usando traversing
        // busco el li más cercano, que debe ser el que contiene toda la info del producto 
        const productoElement = button.closest('li');

        if (!productoElement) {
            console.error('Elemento producto no encontrado');
            return;
        }

        try {
            // Feedback visual inmediato
            productoElement.style.opacity = '0.5';
            button.disabled = true;
            
            const response = await fetch(`${url}/${producto_id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Animación suave antes de remover
                productoElement.style.transition = 'all 0.3s ease';
                productoElement.style.transform = 'translateX(-100%)';
                productoElement.style.opacity = '0';
                
                setTimeout(() => {
                    productoElement.remove();
                    // No usar alert() en producción
                    mostrarNotificacion('Producto borrado correctamente', 'success');
                }, 300);
                
            } else {
                const respuesta = await response.json();
                // Revertir cambios visuales
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

// Helper para notificaciones (mejor que alert())
function mostrarNotificacion(mensaje: string, tipo: 'success' | 'error') {
    // Implementar toast notification o similar
    console.log(`${tipo}: ${mensaje}`);
}

export { borrarProductos };
