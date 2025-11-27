import { Router } from "express";
import { requireAuthAPI } from "../middlewares/middlewares-auth";
import { autenticarUsuario } from "../services/auth-services";
import { HttpError } from "../types/http-error";

const router = Router();

router.post('/login', async (req, res) => {
    const usuario: Usuario = await autenticarUsuario(req.body.username, req.body.password);

    req.session.usuario = usuario;

    return res.status(200).json({ username: usuario.username });
});

router.post('/cerrar_sesion', requireAuthAPI, async (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            throw new HttpError(500, 'Error al cerrar sesión');
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    });
});

export default router;
