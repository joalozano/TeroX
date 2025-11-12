import { usuarioTableDef } from "../estructuras.js";
import { crear_nav_bar } from "../html-operation/crear_nav_bar.js";
import { getFormByID, getElementByID, getElementsByClass } from "../html-operation/get.js";
import { setAttrs } from "../html-operation/html_elements.js";
import { formToDict } from "../html-operation/parsers.js";
import { crear_formulario } from "./crear_formulario.js";

const id_formulario: string = 'registerForm';
const form: HTMLFormElement = getFormByID(id_formulario);
const errorMessage: HTMLElement = getElementByID('errorMessage');

//primero tengo que genersar el formulario a partir de tableDefs
document.addEventListener('DOMContentLoaded', async () => {
    crear_nav_bar();
    const submitTexcontent: string = 'Registrarse';
    const clase = 'form-group';
    crear_formulario(form, usuarioTableDef.columns, [link_a_login()], submitTexcontent, clase);
});

//usado en register para enviar formulario y actualizar pagina en caso de exito
form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = formToDict(form);
    console.log(formData);
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

//voy a hacerlo de la forma más rápida, voy a meter todo en columna
//a ver del back se el nombre de la columna, si sé el nombre de la columna entonces
//puedo actuar acorde a

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