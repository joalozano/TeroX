export function filtrarBusqueda()
{
	const barra = document.getElementById("search-bar") as HTMLInputElement;
	const contenido_barra = barra.value.toUpperCase(); // volvemos todo mayúscula para comparar "case-insensitive"
	const lista_productos = document.getElementById("lista_productos") as HTMLElement;
	const productos = lista_productos.getElementsByTagName("li");
	if (productos != null) {
		for (var i = 0; i < productos.length; i++) {
			const elemento_nombre = productos[i]!.getElementsByTagName("p")[0] as HTMLElement;
			const nombre = elemento_nombre.textContent.toUpperCase(); // el primer <p> en cada item-producto es el nombre del producto.
			if (nombre.indexOf(contenido_barra) > -1) // encontramos parte de nuestra búsqueda en alguna parte del nombre del producto
				productos[i]!.style.display = "flex";
			else
				productos[i]!.style.display = "none"; // ocultamos si no encontramos el producto
		}
	}
}
