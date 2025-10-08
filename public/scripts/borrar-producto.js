"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//import {ruta_backend} from alguna variable global?
function getFormByID(id) {
    return document.getElementById(id);
}
function getFormByClass(clase) {
    return document.getElementById(clase);
}
function getButtonsByClass(buttons) {
    return document.getElementsByClassName(buttons);
}
// formulario pa despues
//const formularios = getFormsByClass('pedido_de_borrado')
const buttons = getButtonsByClass('pedido_de_borrado');
const exito = 200;
const ruta_backend = "/api/borrar/productos";
Array.from(buttons).forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        //parsea el formulario como un diccionario
        const producto_id = button.dataset["id"];
        console.log("PRODUCTO_ID: ", producto_id);
        console.log("SE EJECUTO SCRIPT, SE OBTUVO EL FORMULARIO");
        fetch(ruta_backend, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ producto_id: producto_id }),
        })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            const respuesta = yield response.json();
            if (response.status == exito) {
                //obtengo producto
                const producto_borrado = document.getElementById(respuesta.producto_borrado);
                //SE SUPONE QUE NO ME VA A LLEGAR ALGO NULL, ANTES VA A SALTAR UN ERROR EN LA BD
                producto_borrado === null || producto_borrado === void 0 ? void 0 : producto_borrado.remove();
            }
            else {
                //acá debería decirle al usuario que no se puedo borrar
            }
        }));
    });
});
/* script para agregar, hay que mover a otro archivo después */
const form = getFormByID("form_agregar_producto");
const ruta_backend_agregar = "/api/agregar/productos";
form === null || form === void 0 ? void 0 : form.addEventListener('submit', (event) => {
    event.preventDefault();
    const campos_form = form.elements;
    const form_parseado = { 'nombre_del_producto': obtener_valor_de_campo_con_nombre(campos_form, 'nombre_del_producto'),
        'precio': obtener_valor_de_campo_con_nombre(campos_form, 'precio'),
        'stock': obtener_valor_de_campo_con_nombre(campos_form, 'cantidad'),
        'descripcion': obtener_valor_de_campo_con_nombre(campos_form, 'descripcion'),
        'imagen': obtener_valor_de_campo_con_nombre(campos_form, 'imagen')
    };
    console.log("Nombre del producto a añadir:", form_parseado);
    fetch(ruta_backend_agregar, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form_parseado)
    });
});
function obtener_valor_de_campo_con_nombre(campos_form, nombre_de_campo) {
    var _a;
    return (_a = campos_form.namedItem(nombre_de_campo)) === null || _a === void 0 ? void 0 : _a.value;
}
