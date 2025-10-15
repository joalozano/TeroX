import { formToDict } from "./html-operation/parsers.js";


export function editarProducto(url: string) {
    const form = document.getElementById("form_editar_producto") as HTMLFormElement;


    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const producto_id = form.dataset["id"];
        const data: { [key: string]: string; } = formToDict(form);
        try {
            const response = await fetch(`${url}/${producto_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert("Producto agregado correctamente");
                form.reset();
            } else {
                alert("Error al agregar producto");
            }
        } catch (err) {
            console.error(err);
            alert("Error en la petición");
        }
    });
}
