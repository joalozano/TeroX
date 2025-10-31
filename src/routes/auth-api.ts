import { Router } from "express";
import pool from "../config/db";
import { requireAuthAPI } from "../middlewares/middlewares-auth";
import { autenticarUsuario } from "../services/auth-services";
import { enviar_error_con_status, enviar_exito_con_status } from "./interfaces";

const router = Router();

router.post('/login', async (req, res) => {
    const usuario: Usuario | null = await autenticarUsuario(pool, req.body.username, req.body.password);

    if (usuario) {
        req.session.usuario = usuario;
        return enviar_exito_con_status(res, 200, 'Login exitoso');
    }

    return enviar_error_con_status(res, 400, 'Error: nombre de usuario o contraseña incorrecto')
});

router.post('/cerrar_sesion', requireAuthAPI, async (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return enviar_error_con_status(res, 500, 'Error al cerrar sesión');
        }
        res.clearCookie('connect.sid');
        return enviar_error_con_status(res, 200, 'Sesión cerrada exitosamente');
    });
});

router.get('/usuario_actual', requireAuthAPI, async (req, res) => {
    const usuario = req.session.usuario;
    return res.json({ usuario_id : usuario?.usuario_id});
})

export default router;
