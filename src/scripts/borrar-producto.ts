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

async function borrarProductos(url: string) {
    const buttons = getButtonsByClass('pedido_de_borrado');

    Array.from(buttons).forEach((button: HTMLElement) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const producto_id = button.dataset["id"];

            fetch(`${url}/${producto_id}`, {
                method: 'DELETE',
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
