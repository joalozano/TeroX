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

/* script para agregar, hay que mover a otro archivo después */

const form = getFormByID("form_agregar_producto")
const ruta_backend_agregar: string =  "/api/agregar/productos"

form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const campos_form = form.elements;
    const form_parseado = {'nombre_del_producto' : obtener_valor_de_campo_con_nombre(campos_form, 'nombre_del_producto'),
    'precio' : obtener_valor_de_campo_con_nombre(campos_form, 'precio'),
    'stock': obtener_valor_de_campo_con_nombre(campos_form, 'cantidad'),
    'descripcion' : obtener_valor_de_campo_con_nombre(campos_form, 'descripcion'),
    'imagen' : obtener_valor_de_campo_con_nombre(campos_form, 'imagen')
    }
    console.log("Nombre del producto a añadir:", form_parseado);

    fetch(ruta_backend_agregar, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form_parseado)
    })

    /* Necesito añadir dinámicamente el producto que acabo de agregar */
    
})

function obtener_valor_de_campo_con_nombre(campos_form: HTMLFormControlsCollection, nombre_de_campo: string): string {
    return (campos_form.namedItem(nombre_de_campo) as HTMLInputElement)?.value;
}
