import { Router } from "express";
import pool from "../config/db";
import { requireAuthAPI } from "../middlewares/middlewares-auth";
import { autenticarUsuario } from "../services/auth-services";
import { enviar_error_con_status, enviar_exito_con_status } from "./interfaces";

const router = Router();

router.post('/login', async (req, res) => {
    
    const usuario: Usuario | null = await autenticarUsuario(pool, req.body.username, req.body.password)

    if (!(usuario === null)){
        req.session.usuario= usuario;
        const status = 200;
        return enviar_exito_con_status(res, status, 'Login exitoso')
    }

	return enviar_error_con_status(res, 200, 'Error: nombre de usuario o contraseña incorrecto')
});

router.post('/cerrar_sesion', requireAuthAPI, async (req, res) => {
    //debería llegarme un formulario con la info
    
    req.session.destroy((err) => {
        if (err) {
            return enviar_error_con_status(res, 500, 'Error al cerrar sesión');
            console.error('Error al cerrar sesión:', err);
        }
        
        res.clearCookie('connect.sid');
        
        return enviar_error_con_status(res, 200, 'Sesión cerrada exitosamente');
        
    });
});

export default router;