import { getElementByID } from "./utils/get-elements-by-util.js";

async function comprar_productos(url: string) {
    // Usar event delegation en el contenedor de todos los productos
    const contenedorProductos = getElementByID('lista_productos');

    console.log("CONTENEDOR PRODUCTOS: ", contenedorProductos);

    if (!contenedorProductos) return;

    //voy a escuchar cualquier click y luego veo si es uno sobre un boton de borrado
    contenedorProductos.addEventListener('click', async (event) => {
        //el click es sobre todo el contenedor, acá selecciono el HTMLElement donde se hizo click en específico
        const target = event.target as HTMLElement;

        //si el elemento sobre el que fue el click no tiene como padre un boton de borrado o es 
        //el mismo boton, salgo
        const button = target.closest('.pedido_compra') as HTMLButtonElement;
        console.log("BUTTON: ", button)
        if (!button) return;

        event.preventDefault();

        //en este punto ya sé que el click fue sobre o "adentro" un boton de borrado
        const producto_id = button.getAttribute("data-id");

        console.log("PRODUCTO ID: ", producto_id);
        try {

            button.disabled = true;
            const responseFalsa = true;
            //tengo que ver que el producto aún se puede comprar
            const response = await fetch(`${url}/${producto_id}`, {
                method: 'GET'
            });
            console.log("RESPONSE OKAY?: ", response.ok);
            if (responseFalsa) {
                //acá debería cargar la página nueva con el formulario de compra
                //ya que el producto aún sigue disponible
                console.log("el boton anda");
                window.location.assign(`/comprar_formulario?producto_id=${producto_id}`);
            } else {
                const respuesta = await response.json();
                // Revertir cambios visuales
                button.disabled = false;
                console.log(respuesta.error || 'Error al borrar producto', 'error');
            }
        } catch (error) {
            button.disabled = false;
            console.log('Error de conexión', 'error');
            console.error(error);
        }
    });
}



export { comprar_productos };
