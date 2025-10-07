import { Router } from "express";

const router = Router();

router.get("/productos", async (_, res) => {

	return res.render('productos');
});

export default router;
