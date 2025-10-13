import { getElementByID } from "./html-operation/get.js";
import { setAttrs } from "./html-operation/html_elements.js";

export function crear_nav_bar(){
    const nav_bar = getElementByID("nav-bar");
    
    //a nav_bar le tengo que agregar el logo
    const logo = document.createElement('div');
    setAttrs(logo, {class: 'logo'})
    
    const link_inicio = document.createElement('a');
    setAttrs(link_inicio, {href : '/'});

    const imagen_logo = document.createElement('img');
    setAttrs(imagen_logo, {src: "./imagenes-marca/logo-yinhe.png",  alt:"Logo de Yinhe tenis de mesa"}) 
    link_inicio.appendChild(imagen_logo);

    logo.appendChild(link_inicio);


    const nav_list = document.createElement('ul');
    
    const inicio_item = document.createElement('li');
    const link_inicio2 = document.createElement('a');
    setAttrs(link_inicio2, {href : '/'});
    link_inicio2.textContent = 'Inicio';
    inicio_item.appendChild(link_inicio2);
    nav_list.appendChild(inicio_item);

    const cerrar_sesion_item = document.createElement('li');
    const link_cerrar_sesion = document.createElement('div');
    setAttrs(link_cerrar_sesion, {id : 'cerrar-sesion'});
    link_cerrar_sesion.textContent = 'Cerrar sesión';
    cerrar_sesion_item.appendChild(link_cerrar_sesion);
    nav_list.appendChild(cerrar_sesion_item)

    const best_anime = document.createElement('li');
    const anime_item = document.createElement('a');
    setAttrs(anime_item, {href: "https://www.youtube.com/watch?v=-deSKW4_KI8"});
    anime_item.textContent = "Best anime";
    best_anime.appendChild(anime_item);
    nav_list.appendChild(best_anime);


    nav_bar.appendChild(logo);
    nav_bar.appendChild(nav_list);
}

