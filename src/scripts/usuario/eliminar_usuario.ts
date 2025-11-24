import { mostrarNotificacion } from "../utils/mostrar-notificacion.js";

export function agregar_boton_eliminar_usuario(url: string) {
        const button = document.getElementById("pedido_de_borrado_usuario") as HTMLButtonElement;

        button.addEventListener("click", async (event) => {
            event.preventDefault();
            //agregar confirmacion
            const confirmacion = confirm("¿Está seguro de que desea eliminar su usuario? Esta acción no se puede deshacer.");
            if (!confirmacion) return;

            try {
                const response = await fetch(`${url}/${sessionStorage["username"]}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    mostrarNotificacion("No se pudo eliminar el usuario", "error");
                    return;
                }
                mostrarNotificacion("Usuario eliminado correctamente", "success");
                window.location.href = "/";

            } catch (err) {
                mostrarNotificacion("Error de conexión", "error");
            }
        });
    return url;
}
