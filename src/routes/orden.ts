import { Router, Request, Response } from 'express';
import { executeQuery } from '../services/queryExecutor';
import { HttpError } from '../types/http-error';
import { requireAuthAPI } from '../middlewares/middlewares-auth';

const router = Router();

router.post('/orden', requireAuthAPI, async (req: Request, res: Response) => {
	const producto_id = req.body.id;
	const cantidad_a_comprar = req.body.cantidad;
	const tarjeta_crédito = req.body.tarjeta;
	const query_pedirStock = `
	UPDATE terox.productos
   	SET stock = stock - $1
   	WHERE producto_id=$2;
	`
	const query_devolverStock = `
	UPDATE terox.productos
   	SET stock = stock + $1
   	WHERE producto_id=$2;
	` // considerar usar aritmética de strings
	const resultado_pedirStock = await executeQuery(query_pedirStock, 
										[cantidad_a_comprar, producto_id],
										'Error al comprar: verifique que haya elegido un producto válido, y que tenga stock actualmente.');
	if (!usarTarjeta(req.body.tarjeta)) {
		const resultado_devolver = await executeQuery(query_devolverStock, 
										[cantidad_a_comprar, producto_id],
										'Error al comprar: verifique que haya elegido un producto válido, y que tenga stock actualmente.');
	}
	// crear orden: FALTA VER QUÉ SE RECIBE POR BODY: NECESITO DIRECCION DE ENTREGA , USERNAME DE C (SESSION) Y V (CONSIGO POR BASES), P_ID, PRECIO UNITARIO, CANTIDAD
	const query_crearOrden = `INSERT INTO terox.ordenes VALUES($1, $2, $3, $4, $5)`;
	//try executeQuery();

	// crear factura: FALTA BUSCAR EN LA BASE LAS ENTIDADES FISCALES DE CADA GRUPO
    return res.status(200).json({
        mensaje: 'Compra realizada con éxito',
    });
});

export default router;
