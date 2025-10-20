import { getElementByID } from "../html-operation/get.js"

//necesito un scrip que al apretar cerrar sesion haga fetch con /auth/cerrar_sesion
async function cerrar_sesion() {
    const cerrar_sesion: HTMLElement = getElementByID('cerrar-sesion');
    const ruta_backend = '/api/auth/cerrar_sesion';

    cerrar_sesion.addEventListener('click', async (event) =>{
        event.preventDefault;
        console.log("FUNCIONA EL CLICK")
        try {
            const response =  await fetch(ruta_backend, {
                method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({message: 'cerrar sesion'})
            });

            if(response.ok){
                //limpiar pantalla y mostrar que se salió correctamente de sesion?
                //creo que no hace falta, solo salto a la pagina de iniciar sesion
                window.location.href = '/login'
            } else {
                alert("error al cerrar sesion")
            }
        } catch (error) {
            //errorMessage.textContent = 'Error de conexión con el servidor';
            console.log("Error: ", error);
            //errorMessage.classList.add('show');
        }


    })
}

export {cerrar_sesion}
