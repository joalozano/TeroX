import { url_productos } from "../config/rutas.js";
import { cargarProductos } from "./cargar-productos.js";

export function agregarEventoBusqueda() {
	const input = document.getElementById("input-buscar") as HTMLInputElement;
	const boton = document.getElementById("btn-buscar") as HTMLButtonElement;

	if (!input || !boton) return;

	boton.addEventListener("click", async () => {
		await ejecutarBusqueda(input.value);
	});

	input.addEventListener("keyup", async (e) => {
		if (e.key === "Enter") {
			await ejecutarBusqueda(input.value);
		}
	});
}

async function ejecutarBusqueda(texto: string) {
	let url = url_productos;

	if (texto.trim() !== "") {
		const params = new URLSearchParams({ like: texto.trim() });
		url = `${url_productos}?${params.toString()}`;
	}

	const compra_habilitada = "compra";
	const respuesta = await fetch(url, { method: "GET" });
	await cargarProductos(respuesta, compra_habilitada);
}
