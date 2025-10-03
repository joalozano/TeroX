//import {ruta_backend} from alguna variable global?
function getFormByID(id: string): HTMLFormElement | null {
    return document.getElementById(id) as HTMLFormElement | null;
}
function getFormByClass(clase: string): HTMLFormElement | null {
    return document.getElementById(clase) as HTMLFormElement | null;
}

function getButtonsByClass(buttons: string) {
    return document.getElementsByClassName(buttons) as HTMLCollectionOf<HTMLElement>;
}
// formulario pa despues
//const formularios = getFormsByClass('pedido_de_borrado')

const buttons = getButtonsByClass('pedido_de_borrado')
const exito = 200;
const ruta_backend: string = "/api/borrar/productos"

Array.from(buttons).forEach((button: HTMLElement) => {
    button.addEventListener('click', (event) => {
        event.preventDefault()
        //parsea el formulario como un diccionario
        const producto_id = button.dataset["id"]
        
        console.log("PRODUCTO_ID: ", producto_id)
        console.log("SE EJECUTO SCRIPT, SE OBTUVO EL FORMULARIO")
        
        fetch(ruta_backend, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ producto_id: producto_id }),
        })
        .then(async (response) => {
            const respuesta = await response.json()
            if (response.status == exito){
                //obtengo producto
                const producto_borrado = document.getElementById(respuesta.producto_borrado)
                //SE SUPONE QUE NO ME VA A LLEGAR ALGO NULL, ANTES VA A SALTAR UN ERROR EN LA BD
                producto_borrado?.remove()
            }
            else{
                //acá debería decirle al usuario que no se puedo borrar
            }
        })
    })
}
)