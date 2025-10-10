//import {ruta_backend} from alguna variable global?
//function getFormByID(id: string): HTMLFormElement | null {
//    return document.getElementById(id) as HTMLFormElement | null;}
//function getFormByClass(clase: string): HTMLFormElement | null {
//    return document.getElementById(clase) as HTMLFormElement | null;}
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getButtonsByClass(buttons) {
    return document.getElementsByClassName(buttons);
}
// formulario pa despues
//const formularios = getFormsByClass('pedido_de_borrado')
function borrarProductos(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const buttons = getButtonsByClass('pedido_de_borrado');
        Array.from(buttons).forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const producto_id = button.dataset["id"];
                fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ producto_id: producto_id }),
                })
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    const respuesta = yield response.json();
                    if (response.ok) {
                        const producto_borrado = document.getElementById(respuesta.producto_borrado);
                        producto_borrado === null || producto_borrado === void 0 ? void 0 : producto_borrado.remove();
                        alert("Producto borrado correctamente");
                    }
                    else {
                        alert("Error al borrar producto");
                        console.error(respuesta.error);
                    }
                }));
            });
        });
    });
}
export { borrarProductos };
