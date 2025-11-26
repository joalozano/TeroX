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

CREATE OR REPLACE FUNCTION procesar_usuario_borrado()
RETURNS TRIGGER AS $$
BEGIN
	BEGIN TRANSACTION;
	UPDATE terox.ordenes SET comprador_username="usuario_eliminado"
	WHERE comprador_username = OLD.username;
	UPDATE terox.ordenes SET vendedor_username="usuario_eliminado"
	WHERE vendedor_username = OLD.username;
	UPDATE terox.identidad_fiscal SET username="usuario_eliminado"
	WHERE username = OLD.username;
	COMMIT;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION procesar_producto_borrado()
RETURNS TRIGGER AS $$
BEGIN
	UPDATE terox.ordenes o
	SET o.estado_de_entrega = 'entrega_cancelada'
	WHERE o.producto_id = OLD.producto_id
	AND estado_de_entrega like 'esperando_producto_vendedor';
	PERFORM pg_notify('entrega_cancelada', OLD.comprador_username);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION registrar_pago()
RETURNS TRIGGER AS $$
BEGIN
	IF not OLD.estado_de_entrega like 'producto_en_centro_distribucion' AND NEW.estado_de_entrega like 'producto_en_centro_distribucion' THEN
		INSERT INTO terox.pagos
		(c, OLD.vendedor_username, nc, df, OLD.cantidad_pedida * OLD.precio_unitario)
		SELECT cuil c, nombre_completo nc, domicilio_fiscal df
		FROM terox.identidad_fiscal idf
		WHERE idf.username = OLD.vendedor_username;
	END IF;
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
DROP TRIGGER IF EXISTS trigger_usuario_borrado ON terox.ordenes;

CREATE TRIGGER trigger_usuario_borrado
BEFORE DELETE ON terox.usuarios
FOR EACH ROW
EXECUTE FUNCTION procesar_usuario_borrado();

-- agregar pago cuando recibimos producto en la central de envios
DROP TRIGGER IF EXISTS trigger_registrar_pago ON terox.ordenes;

CREATE TRIGGER trigger_producto_borrado
AFTER UPDATE ON terox.ordenes
FOR EACH ROW
EXECUTE FUNCTION registrar_pago();
