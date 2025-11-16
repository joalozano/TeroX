import { setAttrs } from "../html-operation/html_elements.js";

async function cargarProductos(url_productos: string) {
    const lista: HTMLElement = document.getElementById("lista_productos")!;
    const mensajeEstado = document.getElementById("mensaje_estado")!;

    try {
        mensajeEstado.textContent = "Cargando productos...";

        const username = sessionStorage.getItem("username");
        const respuesta = await fetch(`${url_productos}?username=${username}`, {
            method: "GET"
        });

        if (!respuesta.ok) throw new Error("Error al obtener productos");

        const productos = await respuesta.json();

        if (!productos || productos.length === 0) {
            mensajeEstado.textContent = "No hay productos disponibles :(";
            return;
        }

        mensajeEstado.remove()

        for (const producto of productos) {
            crear_contenedor_producto_y_agregar_a_lista(producto, lista);
        }
    } catch (error) {
        console.error(error);
        mensajeEstado.textContent = "Ocurrió un error al cargar los productos.";
    }
}

function crear_contenedor_producto_y_agregar_a_lista(producto: any, lista_productos: HTMLElement) {
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
    const campo_cantidad_compra =
        crear_elemento_con_nombre_attrs_y_textcontent(
            'input', { class: 'campo_cantidad_compra', 'data-id': 'cantidad_de_compra',
	    'type': 'number', 'value': '1', 'min': '1', 'max': `${producto.stock}`, 'label': 'Cantidad:' }, '');
    contenedor_producto.appendChild(campo_cantidad_compra);

    const boton_compra =
        crear_elemento_con_nombre_attrs_y_textcontent(
            'button', { class: 'boton_compra', 'data-id': producto.producto_id as string }, 'Comprar');
    contenedor_producto.appendChild(boton_compra);

    lista_productos.appendChild(contenedor_producto);
}

function crear_elemento_con_nombre_attrs_y_textcontent
    (etiqueta: string, attrs: { [key: string]: string }, textContent: string) {

    const elemento = document.createElement(etiqueta);
    setAttrs(elemento, attrs);
    elemento.textContent = textContent
    return elemento;
}



export { cargarProductos, crear_contenedor_producto_y_agregar_a_lista as crear_contenedor_producto };


