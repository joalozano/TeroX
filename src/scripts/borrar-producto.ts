//import {ruta_backend} from alguna variable global?
//function getFormByID(id: string): HTMLFormElement | null {
//    return document.getElementById(id) as HTMLFormElement | null;}
//function getFormByClass(clase: string): HTMLFormElement | null {
//    return document.getElementById(clase) as HTMLFormElement | null;}

function getButtonsByClass(buttons: string) {
    return document.getElementsByClassName(buttons) as HTMLCollectionOf<HTMLElement>;
}
// formulario pa despues
//const formularios = getFormsByClass('pedido_de_borrado')

async function borrarProductos() {
    const buttons = getButtonsByClass('pedido_de_borrado');
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
                    } else {
                        console.error(respuesta.error);
                    }
                });
        });
    });
}

export { borrarProductos };
