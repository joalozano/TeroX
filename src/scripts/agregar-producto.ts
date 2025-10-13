import { formToDict } from "./html-operation/parsers.js";

async function agregarProducto(url: string) {
    const form = document.getElementById("form_agregar_producto") as HTMLFormElement;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const data: { [key: string]: string; } = formToDict(form);

        try {
            const response = await fetch(url, {
                method: "POST",
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

export { agregarProducto };
