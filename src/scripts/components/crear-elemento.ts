import { setAttrs } from "../utils/html_elements.js";

export function crear_elemento_con_nombre_attrs_y_textcontent
    (etiqueta: string, attrs: { [key: string]: string }, textContent: string) {

    const elemento = document.createElement(etiqueta);
    setAttrs(elemento, attrs);
    elemento.textContent = textContent
    return elemento;
}
