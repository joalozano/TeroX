-- Funciones para notificar cambios importantes en la base
CREATE OR REPLACE FUNCTION notificar_imagen_borrada()
RETURNS TRIGGER AS $$
DECLARE
    link TEXT;
BEGIN
    link := OLD.url;

    PERFORM pg_notify('imagen_borrada', link);

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

/* hacemos devoluciones a los compradores cuyas compras fueron canceladas al borrar un usuario de la aplicación
 * Esto debería usar una api al mismo tiempo para efectuar el pago, pero se iría del scope (posiblemente lo
 * implementaríamos con un pg_notify y que TS se encargue).
 */
CREATE OR REPLACE FUNCTION procesar_producto_usuario_borrado()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.username IS NULL THEN
		INSERT INTO terox.pagos(orden_id, cuil, nombre_completo, domicilio_fiscal, monto)
		(SELECT o.orden_id , idf.cuil, idf.nombre_completo,
		idf.domicilio_fiscal, (o.cantidad_pedida * o.precio_unitario)
		FROM terox.ordenes o, terox.identidad_fiscal idf
		WHERE o.producto_id = OLD.producto_id AND o.comprador_username IS NOT NULL AND o.comprador_username = idf.username AND estado_de_entrega like 'esperando_producto_vendedor');
		UPDATE terox.ordenes
		SET estado_de_entrega = 'entrega_cancelada'
		WHERE producto_id = OLD.producto_id
		AND estado_de_entrega like 'esperando_producto_vendedor';
	END IF;
	RETURN NULL;
END;
$$ LANGUAGE plpgsql;

/* Efectuamos el pago a los vendedores que nos traen el producto para poder realizar la entrega.
 * Esto se debería hacer con una api para efectuar el pago, pero decidimos cortarlo para no aumentar la complejidad.
 */
CREATE OR REPLACE FUNCTION registrar_pago()
RETURNS TRIGGER AS $$
DECLARE 
    costo INT;
BEGIN
	IF not OLD.estado_de_entrega like 'producto_en_centro_distribucion' AND NEW.estado_de_entrega like 'producto_en_centro_distribucion' THEN
		costo := OLD.cantidad_pedida * OLD.precio_unitario;
		INSERT INTO terox.pagos(orden_id, cuil, nombre_completo, domicilio_fiscal, monto)
		(SELECT OLD.orden_id, idf.cuil, idf.nombre_completo, idf.domicilio_fiscal, costo
		FROM terox.identidad_fiscal idf
		WHERE idf.username = OLD.vendedor_username);
	END IF;
	RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers
-- Avisar cuando se elimina una imagen
DROP TRIGGER IF EXISTS trigger_imagen_borrada ON terox.imagenes;

CREATE TRIGGER trigger_imagen_borrada
AFTER DELETE ON terox.imagenes
FOR EACH ROW
EXECUTE FUNCTION notificar_imagen_borrada();

-- reemplazar referencias al borrar un usuario
DROP TRIGGER IF EXISTS trigger_producto_usuario_borrado ON terox.productos;

CREATE TRIGGER trigger_producto_usuario_borrado
AFTER UPDATE ON terox.productos
FOR EACH ROW
EXECUTE FUNCTION procesar_producto_usuario_borrado();

-- agregar pago cuando recibimos producto en la central de envios
DROP TRIGGER IF EXISTS trigger_actualizacion_orden ON terox.ordenes;

CREATE TRIGGER trigger_actualizacion_orden
AFTER UPDATE ON terox.ordenes
FOR EACH ROW
EXECUTE FUNCTION registrar_pago();
