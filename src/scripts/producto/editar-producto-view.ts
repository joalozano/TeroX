import { getElementsByClass } from "../html-operation/get.js";

function redirigirAEditarProducto(url: string) {
    const buttons = getElementsByClass("pedido_de_edicion");

    Array.from(buttons).forEach((button: HTMLElement) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            const producto_id = button.dataset["id"];
            if (!producto_id) return;

            window.location.href = `${url}?producto_id=${producto_id}`;
        });
    });
}

export { redirigirAEditarProducto };

