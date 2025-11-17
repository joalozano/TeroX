import { productoTableDef } from "../estructuras.js";
import { setAttrs } from "../html-operation/html_elements.js";
import { crearElementoDesdeRegistro } from "./crear-lista.js";

export function agregarProductoALista(producto: any, lista: HTMLElement) {

    const imagen =
        crear_elemento_con_nombre_attrs_y_textcontent(
            'img', {
            src: `/uploads/${producto.producto_id}`,
            alt: producto.nombre, width: '200'
        }, '');

    const botonBorrar = crear_elemento_con_nombre_attrs_y_textcontent(
        "button",
        { class: "pedido_de_borrado", "data-id": producto.producto_id },
        "Borrar"
    );

    const botonEditar = crear_elemento_con_nombre_attrs_y_textcontent(
        "button",
        { class: "pedido_de_edicion", "data-id": producto.producto_id },
        "Editar"
    );

    const item = crearElementoDesdeRegistro(productoTableDef, producto, imagen, [
        botonBorrar,
        botonEditar
    ]);

    lista.appendChild(item);
}


export function crear_elemento_con_nombre_attrs_y_textcontent
    (etiqueta: string, attrs: { [key: string]: string }, textContent: string) {

    const elemento = document.createElement(etiqueta);
    setAttrs(elemento, attrs);
    elemento.textContent = textContent
    return elemento;
}
