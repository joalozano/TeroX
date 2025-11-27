import { ordenesTableDef } from "../config/estructuras.js";
import { crearElementoDesdeRegistro } from "./crear-lista.js";
import { url_rating } from "../config/rutas.js";

export function agregarOrdenALista(orden: any, lista: HTMLElement, vendedor: boolean = false) {
    const elementos_a_añadir = [];

    if (!vendedor) {
        const buttonRating = document.createElement("button");

        buttonRating.textContent = "Calificar";
        buttonRating.classList.add("btn", "btn-primary", "btn-rating-orden");
        buttonRating.dataset['ordenId'] = orden.orden_id;

        buttonRating.addEventListener("click", () => {
            mostrarInputCalificacion(buttonRating, orden.orden_id);
        });
        elementos_a_añadir.push(buttonRating);
    }

    let item: HTMLElement = crearElementoDesdeRegistro(ordenesTableDef, orden, undefined, elementos_a_añadir);
    lista.appendChild(item);
}


function mostrarInputCalificacion(boton: HTMLButtonElement, ordenId: number) {

    if (boton.parentElement?.querySelector(".rating-input")) return;

    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.max = "5";
    input.placeholder = "1-5";
    input.classList.add("rating-input");

    const btnEnviar = document.createElement("button");
    btnEnviar.textContent = "Enviar";
    btnEnviar.classList.add("btn", "btn-success");

    const msg = document.createElement("span");
    msg.style.color = "red";
    msg.style.marginLeft = "8px";

    btnEnviar.addEventListener("click", async () => {
        const valor = Number(input.value);

        if (isNaN(valor) || valor < 1 || valor > 5) {
            msg.textContent = "Debe ser un número entre 1 y 5.";
            return;
        }

        try {
            await fetch(`${url_rating}/${ordenId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating: valor })
            });

            boton.textContent = "Calificado";
            boton.disabled = true;
            input.remove();
            btnEnviar.remove();
            msg.remove();

        } catch (e) {
            msg.textContent = "Error al enviar.";
        }
    });

    boton.after(input, btnEnviar, msg);
}
