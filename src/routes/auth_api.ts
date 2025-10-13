import { Router } from "express";
import pool from "../config/db";
import {autenticarUsuario, crearUsuario, Usuario} from '../models/auth'
import { requireAuthAPI } from "../models/middleware-auth";
import { enviar_error_con_status, enviar_exito_con_status } from "./interfaces";
const router = Router();

router.post('/login', async (req, res) => {
    
    const usuario: Usuario | null = await autenticarUsuario(pool, req.body.username, req.body.password)
    console.log("USUARIO: ", usuario)
    if (!(usuario === null)){
        req.session.usuario= usuario;
        const status = 200;
        return enviar_exito_con_status(res, status, 'Login exitoso')
    }

	return enviar_error_con_status(res, 200, 'Error: nombre de usuario o contraseña incorrecto')
});

//TAREA: REFACTORIZAR RESPUESTAS AL FRONTEND
router.post('/register',async (req, res) => {
    //debería llegarme un formulario con la info
    
    console.log(req.body);
    const nuevo_usuario: Usuario | null = await crearUsuario(
        pool, req.body.username, req.body.password, req.body.name, req.body.email)
    if (!(nuevo_usuario === null)){
        return enviar_exito_con_status(res, 200, 'Registro exitoso')
    }

    return enviar_error_con_status(res, 400, 'Error: nombre de usuario o contraseña incorrecto');
});

router.post('/cerrar_sesion', requireAuthAPI, async (req, res) => {
    //debería llegarme un formulario con la info
    
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return enviar_error_con_status(res, 500, 'Error al cerrar sesión');
        }
        
        // Limpiar la cookie de sesión
        res.clearCookie('connect.sid'); // Este es el nombre por defecto
        
        return enviar_error_con_status(res, 200, 'Sesión cerrada exitosamente');
        
    });
});

export default router;



