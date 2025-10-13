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

        for (const producto of productos) {
            const li = document.createElement("li");
            li.id = producto.producto_id;
            li.className = "card-product";
            li.innerHTML = `
				<img src="${producto.imagen_url}" alt="${producto.nombre}" width="200" />
				<p>Precio: $${producto.precio}</p>
				<p>Descripción: ${producto.descripcion}</p>
                                <p>Stock: ${producto.stock}</p>
				<button  class="pedido_de_borrado" data-id="${producto.producto_id}">Borrar Producto</button>
				<br>
			`;
            lista.appendChild(li);
        }
    } catch (error) {
        console.error(error);
        mensajeEstado.textContent = "Ocurrió un error al cargar los productos.";
    }
}

export { cargarProductos };
