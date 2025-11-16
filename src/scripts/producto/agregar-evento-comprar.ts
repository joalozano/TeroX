import { crear_elemento_con_nombre_attrs_y_textcontent } from "../html-operation/producto-html.js";

export function agregarEventoRedirigirACompra() {
    const lista = document.getElementById("lista_productos") as HTMLElement;
    const contenedores_productos = lista.getElementsByClassName("card-product");

    for (let i = 0; i < contenedores_productos.length; i++) {

        const contenedor_producto = contenedores_productos[i] as HTMLElement;
        const producto_id = contenedor_producto.id;

        const boton_compra = crear_elemento_con_nombre_attrs_y_textcontent(
            'button', 
            { class: 'boton_compra' },
            'Comprar'
        );

        contenedor_producto.appendChild(boton_compra);

        boton_compra.addEventListener("click", (event: Event) => {
            event.preventDefault();
            window.location.href = `/comprar/${producto_id}`;
        });
    }
}

