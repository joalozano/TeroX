import { setAttrs } from "../html-operation/html_elements.js";

export function crear_contenedor_producto_y_agregar_a_lista(producto: any, lista_productos: HTMLElement) {
    const contenedor_producto =
        crear_elemento_con_nombre_attrs_y_textcontent(
            'li', { id: producto.producto_id as string, class: 'card-product', }, '');

    const imagen =
        crear_elemento_con_nombre_attrs_y_textcontent(
            'img', {
            src: `/uploads/${producto.producto_id}`,
            alt: producto.nombre, width: '200'
        }, '');
    contenedor_producto.appendChild(imagen);

    const nombre =
        crear_elemento_con_nombre_attrs_y_textcontent(
            'h3', {}, `${producto.nombre}`)
    contenedor_producto.appendChild(nombre);

    const precio =
        crear_elemento_con_nombre_attrs_y_textcontent(
            'p', {}, `Precio: $${producto.precio}`)
    contenedor_producto.appendChild(precio)

    const descripcion =
        crear_elemento_con_nombre_attrs_y_textcontent(
            'p', {}, 'Descripción: ' + producto.descripcion);
    contenedor_producto.appendChild(descripcion);

    const stock =
        crear_elemento_con_nombre_attrs_y_textcontent(
            'p', {}, `Stock: ${producto.stock}`);
    contenedor_producto.appendChild(stock);

    const pedido_de_borrado = 
        crear_elemento_con_nombre_attrs_y_textcontent(
        'button', { class: 'pedido_de_borrado', 'data-id': producto.producto_id as string }, 'Borrar Producto');
    contenedor_producto.appendChild(pedido_de_borrado);

    const pedido_de_edicion = 
        crear_elemento_con_nombre_attrs_y_textcontent(
        'button', { class: 'pedido_de_edicion', 'data-id': producto.producto_id as string }, 'Editar Producto');
    contenedor_producto.appendChild(pedido_de_edicion);


    lista_productos.appendChild(contenedor_producto);
}

export function crear_elemento_con_nombre_attrs_y_textcontent
    (etiqueta: string, attrs: { [key: string]: string }, textContent: string) {

    const elemento = document.createElement(etiqueta);
    setAttrs(elemento, attrs);
    elemento.textContent = textContent
    return elemento;
}
