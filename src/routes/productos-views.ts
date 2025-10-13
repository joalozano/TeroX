import { Router } from "express";
import { requireAuth } from "../middlewares/middlewares-auth";
const router = Router();

router.get("/productos", requireAuth, async (_, res) => {
	return res.render('productos');
});

export default router;