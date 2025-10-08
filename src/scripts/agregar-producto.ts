async function agregarProducto() {
    const form = document.getElementById("agregar_producto") as HTMLFormElement;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form); // FormData maneja inputs + archivos
        // pero para usarlo en el backend necesitamos un paquete como multer

        const data: { [key: string]: string } = {};

        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

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
