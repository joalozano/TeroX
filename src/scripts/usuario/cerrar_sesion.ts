import { getElementByID } from "../html-operation/get.js"

async function cerrar_sesion() {
    const cerrar_sesion: HTMLElement = getElementByID('cerrar-sesion');
    const ruta_backend = '/api/auth/cerrar_sesion';

    cerrar_sesion.addEventListener('click', async (event) => {
        event.preventDefault;
        try {
            const response = await fetch(ruta_backend, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: 'cerrar sesion' })
            });

            if (response.ok) {
                window.location.href = '/'
            } else {
                alert("error al cerrar sesion")
            }
        } catch (error) {
            console.log("Error: ", error);
        }


    })
}

export { cerrar_sesion }
