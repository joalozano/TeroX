import express from "express";
import productos_api from "./routes/productos-api";
import productos_views from "./routes/productos-views";
import session from 'express-session';
import { autenticarUsuario, crearUsuario, Usuario } from './models/auth.js';
import { Request, Response, NextFunction } from "express"; 
import * as fs from 'fs'; // si no lo tenés

declare module 'express-session' {
    interface SessionData {
        usuario?: Usuario;
    }
}


const app = express();

app.set('view engine', 'ejs')

app.use(express.json());
app.use(express.static('public'));

app.use("/api", productos_api);
app.use("/", productos_views);

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

app.get("/", async (_, res) => {
	res.render('index');
});

app.listen(3000, () => {
	console.log("Servidor iniciado en http://localhost:3000");
});

