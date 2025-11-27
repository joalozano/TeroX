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

CREATE OR REPLACE FUNCTION procesar_producto_borrado()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.username IS NULL THEN
		UPDATE terox.ordenes
		SET estado_de_entrega = 'entrega_cancelada'
		WHERE producto_id = OLD.producto_id
		AND estado_de_entrega like 'esperando_producto_vendedor';
		/* pagarle al comprador
		costo := OLD.cantidad_pedida * OLD.precio_unitario;
		INSERT INTO terox.pagos
		(c, OLD.comprador_username, nc, df, costo)
		SELECT cuil c, nombre_completo nc, domicilio_fiscal df
		FROM terox.identidad_fiscal idf
		WHERE idf.username = OLD.comprador_username;*/
	END IF;
	RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION registrar_pago()
RETURNS TRIGGER AS $$
DECLARE costo INT;
BEGIN
	IF not OLD.estado_de_entrega like 'producto_en_centro_distribucion' AND NEW.estado_de_entrega like 'producto_en_centro_distribucion' THEN
		costo := OLD.cantidad_pedida * OLD.precio_unitario;
		INSERT INTO terox.pagos
		(c, OLD.vendedor_username, nc, df, costo)
		SELECT cuil c, nombre_completo nc, domicilio_fiscal df
		FROM terox.identidad_fiscal idf
		WHERE idf.username = OLD.vendedor_username;
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
DROP TRIGGER IF EXISTS trigger_producto_borrado ON terox.productos;

CREATE TRIGGER trigger_producto_borrado
AFTER UPDATE ON terox.productos
FOR EACH ROW
EXECUTE FUNCTION procesar_producto_borrado();

-- agregar pago cuando recibimos producto en la central de envios
DROP TRIGGER IF EXISTS trigger_actualizacion_orden ON terox.ordenes;

CREATE TRIGGER trigger_actualizacion_orden
AFTER UPDATE ON terox.ordenes
FOR EACH ROW
EXECUTE FUNCTION registrar_pago();
