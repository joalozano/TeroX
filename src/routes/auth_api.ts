import { Router } from "express";
import pool from "../config/db";
import {autenticarUsuario, crearUsuario, Usuario} from '../models/auth'
import { requireAuthAPI } from "../models/middleware-auth";
const router = Router();

router.post('/login', async (req, res) => {
    
    const usuario: Usuario | null = await autenticarUsuario(pool, req.body.username, req.body.password)
    console.log("USUARIO: ", usuario)
    if (!(usuario === null)){
        req.session.usuario= usuario;
        return res.status(200).json({message: 'Login exitoso'})
    }

	return res.status(400).json({error: 'Error: nombre de usuario o contraseña incorrecto'});
});

//TAREA: REFACTORIZAR RESPUESTAS AL FRONTEND
router.post('/register',async (req, res) => {
    //debería llegarme un formulario con la info
    
    console.log(req.body);
    const nuevo_usuario: Usuario | null = await crearUsuario(
        pool, req.body.username, req.body.password, req.body.name, req.body.email)
    if (!(nuevo_usuario === null)){
        return res.status(200).json({message: 'Registro exitoso'})
    }

    return res.status(400).json({error: 'Error: nombre de usuario o contraseña incorrecto'});
});

router.post('/cerrar_sesion', requireAuthAPI, async (req, res) => {
    //debería llegarme un formulario con la info
    
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ 
                success: false, 
                error: 'Error al cerrar sesión' 
            });
        }
        
        // Limpiar la cookie de sesión
        res.clearCookie('connect.sid'); // Este es el nombre por defecto
        
        return res.status(200).json({ 
            success: true, 
            message: 'Sesión cerrada exitosamente' 
        });
        
    });
});

export default router;