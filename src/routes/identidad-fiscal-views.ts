import { Router } from "express";
import { requireAuth } from "../middlewares/middlewares-auth";

const router = Router();

router.get("/activar-compras", requireAuth, async (req, res) => {
    const username = req.session.usuario?.username;
    return res.render('activar-compras', { username });
});

export default router