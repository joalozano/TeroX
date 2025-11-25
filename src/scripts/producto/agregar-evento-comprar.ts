export function agregarEventoRedirigirACompra() {
    const lista = document.getElementById("lista_productos") as HTMLElement;
    const contenedores_productos = lista.getElementsByClassName("card-item");

    for (let i = 0; i < contenedores_productos.length; i++) {

        const contenedor_producto = contenedores_productos[i] as HTMLElement;
        const producto_id = contenedor_producto.id;

        const boton_compra = contenedor_producto.querySelector('pedido_compra') as HTMLButtonElement;

        if (!boton_compra) continue;
        boton_compra.addEventListener("click", (event: Event) => {
            event.preventDefault();
            window.location.href = `/comprar/${producto_id}`;
        });
    }
}
