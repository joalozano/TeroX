import { Router } from "express";
import pool from "../config/db";
import { requireAuthAPI } from "../models/middleware-auth";
import { enviar_error_con_status, enviar_exito_con_status } from "./interfaces";


const router = Router();

// pool.query("SELECT imagen_url,nombre,precio,descripcion,stock FROM productos"); // ejemplo query para luego mostrar productos.

// implementar PUT para ingresar nuevos productos/publicaciones a la página. Usaría INSERT en SQL.
// implementar POST para actualizar prods, como cuando se realiza una compra y disminuye el stock. Integrar sistema de pago? Usar UPDATE de SQL.
// Implementar DELETE para cuando se quiere borrar una publicación.
// Investigar sanitización de queries (¿hace falta? nosotros hacemos las queries)


//SOLO ACÁ AGREGUÉ EL ROUTER PARA VER SI FUNCIONA
router.get("/ver/productos" ,requireAuthAPI, async (_, res) => {
	const productos = await pool.query('SELECT * FROM terox.productos');

	return res.json(productos.rows);
});

const exito_añadir_producto = "Producto añadido con exito";
router.post("/agregar/productos/", requireAuthAPI, async (req, res) => {
	const nombre_producto = req.body.nombre;
	const precio = parseInt(req.body.precio);
	const stock = parseInt(req.body.stock);
	const descripcion = req.body.descripcion;
	// const imagen, guardamos la imagen
	const imagen_url = req.body.imagen;
	try {
		console.log("Producto:", nombre_producto, "añadido");
		await pool.query(`INSERT INTO terox.productos
			(nombre, precio, stock, descripcion, imagen_url) VALUES ($1, $2, $3, $4, $5)`,
			[nombre_producto, precio, stock, descripcion, imagen_url]);
		console.log(exito_añadir_producto)
		return enviar_exito_con_status(res, 200, exito_añadir_producto);

	} catch (error) {
		if (error instanceof Error) {
			console.error("Error al agregar producto:", error.message);
			return enviar_error_con_status(res, 400, "Error al agregar producto");
		} else {
			console.error("Error desconocido:", error);
			return enviar_error_con_status(res, 400, "Error desconocido");
		}
	}

});

router.post("/editar/productos/", async (req, res) => {
	const producto_id = parseInt(req.body.producto_id);
	const nombre_producto = req.body.nombre_del_producto;
	const precio = parseInt(req.body.precio_del_producto);
	const stock = parseInt(req.body.stock_del_producto);
	const descripcion = req.body.descripcion_del_producto;
	// const imagen

	// validar los inputs

	try {
		await pool.query(`UPDATE terox.productos
			SET nombre = $1, precio = $2, stock = $3, descripcion = $4
			WHERE producto_id = $5`,
			[nombre_producto, precio, stock, descripcion, producto_id]);
		return enviar_exito_con_status(res, 200, "Éxito al añadir prductos");
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error al editar producto:", error.message);
		} else {
			console.error("Error desconocido:", error);
		}
		return enviar_error_con_status(res, 400, 'Error: no se pudo editar el producto' );
	}
});

router.post("/borrar/productos/", async (req, res) => {
	const producto_id = parseInt(req.body.producto_id);

	// esto la bd lo valida, pero capaz no me indica qué fue esto lo que falló
	if (!Number.isInteger(producto_id) || producto_id <= 0) {
		return enviar_error_con_status(res, 400, 'Error: producto_id inválido');
	}

	try {
		await pool.query(`DELETE FROM terox.productos WHERE producto_id = $1`, [producto_id]);
		console.log("BORRAMOS PRODUCTO CON ID:", producto_id);
		return res.status(200).json({ producto_borrado: producto_id });
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error al eliminar producto:", error.message);
			return enviar_error_con_status(res, 400, 'Error: no se pudo eliminar el producto');
		} else {
			console.error("Error desconocido:", error);
			return enviar_error_con_status(res, 400, 'Error desconocido al intentar eliminar producto')
		}

		
	}
});



export default router;
