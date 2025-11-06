import { Router } from "express";
import { requireAuth } from "../middlewares/middlewares-auth";

const router = Router()

router.get('/login', (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/productos');
    }

    res.render('login.ejs');
});

router.get('/register', (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/productos');
    }

    res.render('register.ejs');
});

router.get('/editar-usuario', requireAuth, (_req, res) => {
    res.render('editar_usuario.ejs');
});

export default router
