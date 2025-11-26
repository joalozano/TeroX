import { Router } from "express";
import { requireAuth } from "../middlewares/middlewares-auth";

const router = Router();

router.get("/ordenes", requireAuth, async (_, res) => {
    return res.render('ordenes');
});

export default router;
