import { Router } from "express";
import { requireAuth } from "../middlewares/middlewares-auth";

const router = Router();

router.get("/productos", requireAuth, async (_, res) => {
	return res.render('productos');
});

router.get("/editar_producto", requireAuth, async (req, res) => {
	const producto_id = req.query['producto_id'];
	return res.render('editar_producto', { producto_id });
});

router.get("/comprar/:id", requireAuth, async (req, res) => {
	const producto_id = req.params['id'];
	return res.render('comprar_formulario', { producto_id });
});

export default router;
