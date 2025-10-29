import { setAttrs } from "./html-operation/html_elements.js";

async function cargarProductos(url: string) {
    const lista = document.getElementById("lista_productos")!;
    const mensajeEstado = document.getElementById("mensaje_estado")!;

    try {
        mensajeEstado.textContent = "Cargando productos...";

        const respuesta = await fetch(url, {
            method: "GET"
        });

        if (!respuesta.ok) throw new Error("Error al obtener productos");

        const productos = await respuesta.json();

        if (!productos || productos.length === 0) {
            mensajeEstado.textContent = "No hay productos disponibles :(";
            return;
        }

        mensajeEstado.remove()
        /* 
        const li = document.createElement("li");
        li.id = producto.producto_id;
        li.className = "card-product";
        li.innerHTML = `
			<img src="${producto.imagen_url}" alt="${producto.nombre}" width="200" />
			<p>Precio: $${producto.precio}</p>
			<p>Descripción: ${producto.descripcion}</p>
                            <p>Stock: ${producto.stock}</p>
			<button  class="pedido_de_borrado" data-id="${producto.producto_id}">Borrar Producto</button>
			<button class="pedido_de_edicion" data-id="${producto.producto_id}">Editar Producto</button>
		`;
        */
        for (const producto of productos) {
            const contenedor_producto = crear_elemento_con_nombre_attrs_y_textcontent(
                'li', { id: producto.producto_id as string, class: 'card-product', }, '');
            
            const imagen = crear_elemento_con_nombre_attrs_y_textcontent(
                'img', {src : producto.imagen_url, alt : producto.nombre, width : '200'}, '');
            contenedor_producto.appendChild(imagen);

            const nombre = crear_elemento_con_nombre_attrs_y_textcontent(
                'h3', {}, `${producto.nombre}`)
            contenedor_producto.appendChild(nombre);

            const precio = crear_elemento_con_nombre_attrs_y_textcontent(
                'p', {}, `Precio: $${producto.precio}`)
            contenedor_producto.appendChild(precio)
            
            const descripcion = crear_elemento_con_nombre_attrs_y_textcontent(
                'p', {}, 'Descripción: ' + producto.descripcion);
            contenedor_producto.appendChild(descripcion);

            const stock = crear_elemento_con_nombre_attrs_y_textcontent(
                'p', {}, `Stock: ${producto.stock}`);
            contenedor_producto.appendChild(stock);

            const pedido_de_borrado = crear_elemento_con_nombre_attrs_y_textcontent(
                'button', { class: 'pedido_de_borrado', 'data-id': producto.producto_id as string }, 'Borrar Producto');
            contenedor_producto.appendChild(pedido_de_borrado);

            const pedido_de_edicion = crear_elemento_con_nombre_attrs_y_textcontent(
                'button', { class: 'pedido_de_edicion', 'data-id': producto.producto_id as string }, 'Editar Producto');
            contenedor_producto.appendChild(pedido_de_edicion);

            lista.appendChild(contenedor_producto);
        }
    } catch (error) {
        console.error(error);
        mensajeEstado.textContent = "Ocurrió un error al cargar los productos.";
    }
}

export { cargarProductos };
    function crear_elemento_con_nombre_attrs_y_textcontent
    (etiqueta: string, attrs: {[key: string]: string}, textContent: string) {
        
        const elemento = document.createElement(etiqueta);
        setAttrs(elemento, attrs);
        elemento.textContent = textContent
        return elemento;
    }

