import { Router } from "express";

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

export default router