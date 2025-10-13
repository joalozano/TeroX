import {getElementsByClass} from "./html-operation/get.js";


async function borrarProductos() {
    const buttons = getElementsByClass('pedido_de_borrado');
    const ruta_backend: string = "/api/borrar/productos";

    Array.from(buttons).forEach((button: HTMLElement) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const producto_id = button.dataset["id"];

            fetch(ruta_backend, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ producto_id: producto_id }),
            })
            .then(async (response) => {
                const respuesta = await response.json();
                if (response.ok) {
                    const producto_borrado = document.getElementById(respuesta.producto_borrado);
                    producto_borrado?.remove();
                    alert("Producto borrado correctamente");
                } else {
                    alert("Error al borrar producto");
                    console.error(respuesta.error);
                }
            });
        });
    });
}

export { borrarProductos };
