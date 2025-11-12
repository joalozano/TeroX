import { ColumnDef,usuarioTableDef } from "../estructuras.js";
import { crear_nav_bar } from "../html-operation/crear_nav_bar.js";
import { getFormByID, getElementByID, getElementsByClass } from "../html-operation/get.js";
import { setAttrs } from "../html-operation/html_elements.js";
import { formToDict } from "../html-operation/parsers.js";

const id_formulario: string = 'registerForm';
const form: HTMLFormElement = getFormByID(id_formulario);
const errorMessage: HTMLElement = getElementByID('errorMessage');

//primero tengo que genersar el formulario a partir de tableDefs
document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();
    const submitTexcontent: string = 'Registrarse';
    crear_formulario_prueba(form, usuarioTableDef.columns, [link_a_login()], submitTexcontent);
});

//usado en register para enviar formulario y actualizar pagina en caso de exito
form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = formToDict(form);

    try {
        const response = await fetch('api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok) {
            eliminar_campos_de_registro();

            crear_boton_ir_a_login();
        } else {
            // Mostrar error
            errorMessage.textContent = data.error || 'Error al iniciar sesión';
            errorMessage.classList.add('show');
        }
    } catch (error) {
        errorMessage.textContent = 'Error de conexión con el servidor';
        console.log("Error: ", error);
        errorMessage.classList.add('show');
    }
});


function link_a_login(): HTMLElement {
    const link: HTMLElement = document.createElement('a');
    setAttrs(link, { class: 'link', href: '/login', id: 'link-register-login' });
    link.textContent = '¿Ya tienes una cuenta? Inicia sesión aquí';
    return link;
}

export function crear_formulario_prueba(form: HTMLElement, columnas_usuario: ColumnDef[], 
    extras: HTMLElement[], submitTexcontent: string) {
    //convertir tableDef en un objeto al que le pueda pedir una tabla en específico
    columnas_usuario.forEach((columna: ColumnDef) => {
        const clase = 'form-group';
        //ahora falta cambiar crearCampo para que acepte ColumnDef
        //si solo uso columna van a faltarme campos que no tienen sentido en columna
        //tendría que agregarle campos que son específicos del front
        //podría ponerlo igual, aunque no forme parte de la estructura de la tabla
        form.appendChild(crearCampo(columna, clase));
    });

    const submit: HTMLElement = document.createElement('button');
    setAttrs(submit, {id : 'boton-principal', type : 'submmit', class : 'btn-login'});
    submit.textContent = submitTexcontent;
    form.appendChild(submit);

    extras.forEach((extra: HTMLElement) => {
        form.appendChild(extra);
    })
}

//voy a hacerlo de la forma más rápida, voy a meter todo en columna
//a ver del back se el nombre de la columna, si sé el nombre de la columna entonces
//puedo actuar acorde a
function crearCampo(columna: ColumnDef, clase: string) {
    const div = document.createElement('div');
    setAttrs(div, {class : clase});
    
    const label = document.createElement('label');
    setAttrs(label, {for : columna.name});
    label.textContent = columna.title!;

    const input = document.createElement('input');
    setAttrs(input, {type : columna.htmlType as string, id : columna.name, 
        required : columna.nullable, name : columna.name, 
        autocomplete: columna.autocomplete as string, placeholder : columna.description as string})

    div.appendChild(label);
    div.appendChild(input);    
    return div;
}

function crear_boton_ir_a_login() {
    const boton_principal = getElementByID("boton-principal");

    const boton_nuevo = document.createElement("button");
    setAttrs(boton_nuevo, { type: "button", class: "btn-login" });

    const link_login: HTMLElement = document.createElement("a");
    setAttrs(link_login, { class: "link", href: "/login" });
    link_login.textContent = 'Registro existoso, puede iniciar sesión';
    boton_nuevo.appendChild(link_login);
    boton_principal.replaceWith(boton_nuevo);
}

function eliminar_campos_de_registro() {
    //hago un forEach porque getElementsByClass devuelve un HTMLCollection
    //y no un solo HTMLElement. Podría cambiar la clase de los form-groups a un ID pero bueno... 
    const form_groups = getElementsByClass("form-group");
    Array.from(form_groups).forEach((form_group: HTMLElement) => {
        form_group.remove();
    });

    const link_registro = getElementByID('link-register-login');
    link_registro.remove();
}