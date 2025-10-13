import express from "express";
import generarCRUD from "./routes/crud-api";
import productos_views from "./routes/productos-views";
import login from "./routes/login"
import session from 'express-session';
import { Usuario } from './models/auth.js';
import auth_api from "./routes/auth_api";
import register from "./routes/register";


//RECORDAR QUE ESTO LO TENGO QUE USAR EN LOGIN (para poder validar y algunas cosas mas
//supongo)
declare module 'express-session' {
    interface SessionData {
        usuario?: Usuario;
    }
}


const app = express();

app.set('view engine', 'ejs')

app.use(express.json());
app.use(express.static('public'));

// Configuración de sesiones
app.use(session({
    secret: process.env["SESSION_SECRET"] || "para que tipe",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 día
    }
}));

const atributos_producto = ["nombre", "descripcion", "precio", "imagen_url", "stock"];
app.use("/api", generarCRUD("/productos", "producto_id", atributos_producto));

app.use("/", productos_views);



app.use("/auth", auth_api);

app.use("/login", login);
app.use("/register", register)

app.get("/", async (_, res) => {
	res.render('index');
});

app.listen(3000, () => {
	console.log("Servidor iniciado en http://localhost:3000");
});

