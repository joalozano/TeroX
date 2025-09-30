import { Router } from "express";
// import { pool } from "../config/db";

const router = Router();

router.get("/index", async (_, res) => {
	console.log("POR FAVOR QUE LLEGUE ACÁ");

	return res.send(html);
});

export default router;

const html: string = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../styles/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cossette+Titre:wght@400;700&display=swap" rel="stylesheet">
    <title>Productos</title>
</head>

<body>
    <header>
        <section class="nav-bar">
            <img src="../resources/yinhe_logo_jjyamada.png" alt="Logo de Yinhe tenis de mesa">
            <nav>
                <ul class="nav-list">
                    <li> 
                        <a href="./index.html">Inicio</a>
                    </li>

                    <li> 
                        <a href="./productos.html">Productos</a>
                    </li>

                    <li> 
                        <a href="./contact.html">Contactos</a>
                    </li>

                    <li> 
                        <a href="https://www.youtube.com/watch?v=_cZk8vfzcj0">Best Anime</a>
                    </li>
                </ul>
            </nav>
        </section>
    </header>

    <main>
        <section class="productos-home">
            <h2> Nuestros mejores productos </h2>

            <div class="contenedor-tarjeta">                
                <article class="tarjeta-producto">
                    <img class="product-information-item" src="../resources/A94c8895b979948e9ae5e4305743bc7daG.jpg_.avif" width="150" height="200" alt="Gome de tenis de mesa Big Dipper">
                    <h3>Big Dipper V</h3>
                    <p> Goma pegagosa con tecnología MaxTense. Perfecta para forehand. Nivel profecional</p>
                </article>

                <article class="tarjeta-producto">
                    <img class="product-information-item" src="../resources/jupiter3-asia.png" width="200" height="200" alt="Goma Jupiter 3 Asia">
                    <h3>Jupiter3 Asia</h3>
                    <p>Goma pegadosa con texonología MaxTense. Ideal para forehand. Nivel medio</p>
                </article>

                <article class="tarjeta-producto">
                    <img class="product-information-item" src="../resources/battle-2-national.avif" width="200" height="200" alt="Goma Jupiter 3 Asia">
                    <h3>Battle 2 National</h3> 
                    <p>Goma pegagosa china clásica. Ideal para un forehand fuerte. Nivel profesional</p>   
                </article>
                    
            <div>
        </section>

        <h1>Pruebas de productos</h1>
        <section>
            <video controls>
                <source src="../resources/pelicha_pintando.mp4" type="video/mp4">
                Tu navegador no soporta la reproducción de video. Era sobre una
                pelicha pintando
              </video>              
        </section>        
    </main>

    <footer>
        <section>
            <h2>Contacto</h2>
            <img src="../resources/form-icon.png" alt="Ícono de formulario" width="50">
            <a href=" ./pages/contact.html">Completa un formulario para comunicarte</a>
        </section>
    </footer>
</body>
</html>`