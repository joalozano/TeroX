import { TableDef } from "../config/estructuras.js";

export function crearElementoDesdeRegistro(
    tableDef: TableDef,
    registro: any,
    imagen?: HTMLElement,
    extraElements: HTMLElement[] = []
): HTMLElement {

    const contenedor = document.createElement("li");
    contenedor.classList.add("card-item");

    contenedor.id = registro[tableDef.pk[0]].toString();

    if (imagen) {
        contenedor.appendChild(imagen);
    }

    for (const col of tableDef.columns) {
        if (col.hidden) continue;
        const valor = registro[col.name];

        const elemento = document.createElement("p");
        const titulo = col.title ? `${col.title}: ` : '';

        elemento.textContent = `${titulo} ${valor ?? ''}`;
        contenedor.appendChild(elemento);
    }

    extraElements.forEach(elem => contenedor.appendChild(elem));

    return contenedor;
}
