import { formToDict } from "./html-operation/parsers.js";

async function agregarProducto() {
    const form = document.getElementById("agregar_producto") as HTMLFormElement;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const data: { [key: string]: string; } = formToDict(form);

        try {
            const response = await fetch("/api/agregar/productos", {
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
