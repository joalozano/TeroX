import express from "express";
import generarCRUD from "./routes/crud-api";
import productos_views from "./routes/productos-views";

import session from 'express-session';

import { requireAuthAPI, replacePasswordForHash } from './middlewares/middlewares-auth'
import auth_api from "./routes/auth-api";
import user_session_views from "./routes/user-sesion-views";


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
const middlewares_producto: MiddlewareCRUD = {
    get: [],
    post: [requireAuthAPI],
    put: [requireAuthAPI],
    delete: [requireAuthAPI]
};
app.use("/api", generarCRUD("/productos", "producto_id", atributos_producto, middlewares_producto));

const atributos_usuario = ["username", "password_hash", "nombre", "email"];
const middlewares_usuarios: MiddlewareCRUD = {
    get: [(_, res, __) => { res.sendStatus(403); }],
    post: [replacePasswordForHash],
    put: [],
    delete: []
};

app.use("/api", generarCRUD("/usuarios", "id", atributos_usuario, middlewares_usuarios));
app.use("/api/auth", auth_api);

app.use("/", productos_views);
app.use("/", user_session_views);


app.get("/", async (_, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log("Servidor iniciado en http://localhost:3000");
});
