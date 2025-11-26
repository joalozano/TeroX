export function agregarEventoRedirigirACompra() {
    const lista = document.getElementById("lista_productos") as HTMLElement;

    lista.addEventListener("click", (event: Event) => {
        const boton = (event.target as HTMLElement).closest(".pedido_compra") as HTMLElement | null;
        if (!boton) return;

        const producto_id = boton.getAttribute("data-id");
        if (!producto_id) return;

        window.location.href = `/comprar/${producto_id}`;
    });
}

