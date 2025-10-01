import { Router } from "express";
import pool from "../config/db";

const router = Router();

router.get("/ver/productos", async (_, res) => {
	const productos = await pool.query('SELECT * FROM terox.productos');

<<<<<<< HEAD
	return res.render('productos', { productos: productos.rows });
});
=======
// implementar PUT para ingresar nuevos productos/publicaciones a la página. Usaría INSERT en SQL.
// implementar POST para actualizar prods, como cuando se realiza una compra y disminuye el stock. Integrar sistema de pago? Usar UPDATE de SQL.
// Implementar DELETE para cuando se quiere borrar una publicación.
// Investigar sanitización de queries (¿hace falta? nosotros hacemos las queries)
>>>>>>> 0cb90f3 (notas para futuro)

router.post("/agregar/productos/", async (req, res) => {
	const nombre_producto = req.body.nombre_del_producto;
	const precio = parseInt(req.body.precio_del_producto);
	const stock = parseInt(req.body.stock_del_producto);
	const descripcion = req.body.descripcion_del_producto;
	// const imagen, guardamos la imagen
	const imagen_url = null;

	try {
		await pool.query(`INSERT INTO terox.productos 
			(nombre, precio, stock, descripcion, imagen_url) VALUES ($1, $2, $3, $4, $5)`,
			[nombre_producto, precio, stock, descripcion, imagen_url]);
		return res.sendStatus(200);
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error al eliminar producto:", error.message);
		} else {
			console.error("Error desconocido:", error);
		}

		return res.sendStatus(400);
	}

})

router.post("/editar/productos/", async (_, res) => {
	//const producto_id = parseInt(req.body.producto_id);

	return res.sendStatus(404);
});

router.post("/borrar/productos/", async (req, res) => {
	console.log(req.body);
	const producto_id = parseInt(req.body.producto_id);

	// esto la bd lo valida, pero capaz no me indica qué fue esto lo que falló
	if (!Number.isInteger(producto_id) || producto_id <= 0) {
		return res.status(400).json({ error: 'producto_id inválido' });
	}

	try {
		await pool.query(`DELETE FROM terox.productos WHERE producto_id = $1`, [producto_id]);
		console.log("BORRAMOS PRODUCTO CON ID:", producto_id);
		return res.status(200).json({ producto_borrado: producto_id });
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error al eliminar producto:", error.message);
		} else {
			console.error("Error desconocido:", error);
		}

		return res.sendStatus(400);
	}
});

export default router;
