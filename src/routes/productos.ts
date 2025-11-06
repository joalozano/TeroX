import { Router, Request, Response } from 'express';
import { executeQuery } from '../services/queryExecutor';
import { HttpError } from '../types/http-error';
import { requireAuthAPI } from '../middlewares/middlewares-auth';

const router = Router();

router.put('/comprar/:id', requireAuthAPI, async (req: Request, res: Response) => {
    const producto_id = req.params['id'];
    const cantidad_a_comprar: number = req.body.cantidad;

    const selectQuery = `SELECT stock FROM terox.productos WHERE producto_id = $1`;
    const error_para_cliente = 'Error al intentar comprar el producto';
    const result = await executeQuery(
        selectQuery,
        [producto_id],
        error_para_cliente
    );

    const stock = result.rows[0]?.stock;

    if (stock < cantidad_a_comprar) {
        throw new HttpError(400, 'Stock insuficiente para completar la compra');
    }

    const updateQuery = `
    UPDATE terox.productos
    SET stock = stock - $1
    WHERE producto_id = $2
    RETURNING stock
  `;
    const updateResult = await executeQuery(
        updateQuery,
        [cantidad_a_comprar, producto_id],
        error_para_cliente
    );

    const nuevoStock = updateResult.rows[0]?.stock;

    return res.status(200).json({
        mensaje: 'Compra realizada con éxito',
        stock_restante: nuevoStock
    });
});

export default router;
