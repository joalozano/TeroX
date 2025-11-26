import { productoTableDef } from "../config/estructuras.js";
import { crearElementoDesdeRegistro } from "./crear-lista.js";
import { crear_elemento_con_nombre_attrs_y_textcontent } from "./crear-elemento.js";

export function agregarProductoALista(producto: any, lista: HTMLElement, compra: boolean) {

    const imagen =
        crear_elemento_con_nombre_attrs_y_textcontent(
            'img', {
            src: `/uploads/${producto.producto_id}`,
            alt: producto.nombre, width: '200'
        }, '');

    let item: HTMLElement;

    if (compra) {
        const botonComprar = crear_elemento_con_nombre_attrs_y_textcontent(
            "button",
            { class: "pedido_compra", "data-id": producto.producto_id },
            "Comprar"
        );

        item = crearElementoDesdeRegistro(productoTableDef, producto, imagen, [
            botonComprar,
        ]);
    } else {
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

        item = crearElementoDesdeRegistro(productoTableDef, producto, imagen, [
            botonBorrar,
            botonEditar
        ]);
    }
    lista.appendChild(item);
}
