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
	UPDATE terox.ordenes SET vendedor="usuario_eliminado"
	WHERE comprador_username = OLD.username;
	UPDATE terox.identidad_fiscal SET username="usuario_eliminado"
	WHERE comprador_username = OLD.username;
	COMMIT;
END;
$$ LANGUAGE plpgsql;

-- Triggers
-- Avisar cuando se elimina una imagen
DROP TRIGGER IF EXISTS trigger_imagen_borrada ON terox.imagenes;

CREATE TRIGGER trigger_imagen_borrada
AFTER DELETE ON terox.imagenes
FOR EACH ROW
EXECUTE FUNCTION notificar_imagen_borrada();

-- borrar cosas apropiadas al borrar un usuario
DROP TRIGGER IF EXISTS trigger_usuario_borrado ON terox.ordenes;

CREATE TRIGGER trigger_usuario_borrado
BEFORE DELETE ON terox.usuarios
FOR EACH ROW
EXECUTE FUNCTION procesar_usuario_borrado();
