import { Router } from "express";

const router = Router()

router.get('/', (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/productos');
    }

    res.render('register.ejs');
});

export default router