import express from "express";
import generarCRUD from "./routes/crud-api";
import productos_views from "./routes/productos-views";

import session from 'express-session';

import { requireAuthAPI, replacePasswordForHash } from './middlewares/middlewares-auth'
import { añadir_usuario_id_a_request, verificar_usuario_es_dueño_del_producto } from './middlewares/middlewares-productos'
import auth_api from "./routes/auth-api";
import user_session_views from "./routes/user-sesion-views";
import imagenes_routes from "./routes/images-routes";
import productos_routes from "./routes/productos";

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

const atributos_producto = ["nombre", "descripcion", "precio", "stock", "usuario_id"];
const middlewares_producto: MiddlewareCRUD = {
    get: [],
    post: [requireAuthAPI, añadir_usuario_id_a_request],
    put: [requireAuthAPI, añadir_usuario_id_a_request, verificar_usuario_es_dueño_del_producto],
    delete: [requireAuthAPI, verificar_usuario_es_dueño_del_producto]
};

app.use("/api", generarCRUD("/productos", "producto_id", atributos_producto, middlewares_producto));
app.use("/api", productos_routes);

const atributos_usuario = ["username", "password_hash", "nombre", "email"];
const middlewares_usuarios: MiddlewareCRUD = {
    get: [(_, res, __) => { res.sendStatus(403); }],
    post: [replacePasswordForHash],
    put: [],
    delete: []
};

app.use("/api", generarCRUD("/usuarios", "usuario_id", atributos_usuario, middlewares_usuarios));
app.use("/api/auth", auth_api);

app.use("/", productos_views);
app.use("/", user_session_views);
app.use("/", imagenes_routes);


app.get("/", async (_, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log("Servidor iniciado en http://localhost:3000");
});
