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

CREATE OR REPLACE FUNCTION notificar_orden_aceptada()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.estado_de_pago = 'pagado' THEN
		PERFORM pg_notify('orden_aceptada', id_aceptada);

		RETURN OLD.orden_id;
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

-- Avisar cuando se paga una orden, para generar una factura
DROP TRIGGER IF EXISTS trigger_orden_aceptada ON terox.ordenes;

CREATE TRIGGER trigger_orden_aceptada
AFTER UPDATE ON terox.ordenes
FOR EACH ROW
EXECUTE FUNCTION notificar_orden_aceptada();
