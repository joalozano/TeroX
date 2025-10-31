import { Router, Request, Response } from 'express';
import pool from '../config/db';

const router = Router();

router.put('/comprar/:id', async (req: Request, res: Response) => {
    const producto_id = req.params['id'];
    const cantidad_a_comprar = req.body.cantidad;

    const query = `SELECT stock FROM terox.productos WHERE producto_id = $1`;
    try {
        const result = await pool.query(query, [producto_id]);
        const stock = result.rows[0]?.stock;

        if (stock === undefined) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        if (stock < cantidad_a_comprar) {
            return res.status(400).json({ error: 'Stock insuficiente' });
        }

        const updateQuery = `UPDATE terox.productos SET stock = stock - $1 WHERE producto_id = $2 RETURNING stock`;
        const updateResult = await pool.query(updateQuery, [cantidad_a_comprar, producto_id]);
        const nuevoStock = updateResult.rows[0]?.stock;
        return res.status(200).json({ mensaje: 'Compra realizada con éxito', stock_restante: nuevoStock });

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error al obtener stock:", error.message);
        } else {
            console.error("Error desconocido:", error);
        }

        return res.status(400).json({ error: 'Error al obtener stock del producto' });
    }
});

export default router;
