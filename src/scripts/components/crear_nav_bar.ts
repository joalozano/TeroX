import { getElementByID } from "../utils/get-elements-by-util.js";
import { setAttrs } from "../utils/html_elements.js";

export function crear_nav_bar() {
    const nav_bar = getElementByID("nav-bar");

    //a nav_bar le tengo que agregar el logo
    const logo = document.createElement('div');
    setAttrs(logo, { class: 'logo' })

    const link_inicio = document.createElement('a');
    setAttrs(link_inicio, { href: '/' });

    const imagen_logo = document.createElement('img');
    setAttrs(imagen_logo, { style: "max-width: 120px; max-height: 90px", src: "assets/logo.jpg", alt: "Terox" })
    link_inicio.appendChild(imagen_logo);

    logo.appendChild(link_inicio);


    const nav_list = document.createElement('ul');

    const inicio_item = document.createElement('li');
    const link_inicio2 = document.createElement('a');
    setAttrs(link_inicio2, { href: '/' });
    link_inicio2.textContent = 'Inicio';
    inicio_item.appendChild(link_inicio2);
    nav_list.appendChild(inicio_item);

    const productos_item = document.createElement('li');
    const link_productos = document.createElement('a');
    setAttrs(link_productos, { href: '/productos' });
    link_productos.textContent = 'Mis Productos';
    productos_item.appendChild(link_productos);
    nav_list.appendChild(productos_item);

    link_productos.addEventListener('click', (_event) => {
        sessionStorage.setItem('urlAnterior', '/productos');
    });

    const cerrar_sesion_item = document.createElement('li');
    const link_cerrar_sesion = document.createElement('a');
    setAttrs(link_cerrar_sesion, { id: 'cerrar-sesion' });
    link_cerrar_sesion.textContent = 'Cerrar sesión';
    cerrar_sesion_item.appendChild(link_cerrar_sesion);
    nav_list.appendChild(cerrar_sesion_item)

    const iniciar_sesion_item = document.createElement('li');
    const link_iniciar_sesion = document.createElement('a');
    setAttrs(link_iniciar_sesion, { href: '/login' });
    link_iniciar_sesion.textContent = 'Iniciar sesión';
    iniciar_sesion_item.appendChild(link_iniciar_sesion);
    nav_list.appendChild(iniciar_sesion_item);

    const editar_usuario = document.createElement('li');
    const link_editar_usuario = document.createElement('a');
    setAttrs(link_editar_usuario, { href: '/editar-usuario' });
    link_editar_usuario.textContent = 'Editar Usuario';
    editar_usuario.appendChild(link_editar_usuario);
    nav_list.appendChild(editar_usuario);

    link_editar_usuario.addEventListener('click', (_event) => {
        sessionStorage.setItem('urlAnterior', '/editar-usuario');
    });

    const best_anime = document.createElement('li');
    const anime_item = document.createElement('a');
    const song_item = document.createElement('a');
    setAttrs(anime_item, { href: "https://www.youtube.com/watch?v=-deSKW4_KI8" });
    anime_item.textContent = "Best anime";
    setAttrs(song_item, { href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" });
    song_item.textContent = "Best Song";
    best_anime.appendChild(anime_item);

    nav_list.appendChild(song_item);

    nav_list.appendChild(best_anime);


    nav_bar.appendChild(logo);
    nav_bar.appendChild(nav_list);
}
