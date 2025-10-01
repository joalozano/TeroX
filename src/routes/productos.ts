import { Router } from "express";
import pool from "../config/db";

const router = Router();

router.get("/", async (_, res) => {
	const productos = await pool.query('SELECT * FROM terox.productos');

	return res.render('productos', { productos: productos.rows });
});

export default router;
