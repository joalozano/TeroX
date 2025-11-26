import { ordenesTableDef } from "../config/estructuras.js";
import { crearElementoDesdeRegistro } from "./crear-lista.js";

export function agregarOrdenALista(orden: any, lista: HTMLElement) {
    let item: HTMLElement = crearElementoDesdeRegistro(ordenesTableDef, orden);
    lista.appendChild(item);
}
