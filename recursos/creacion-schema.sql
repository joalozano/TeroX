SET role TO terox_owner;
CREATE schema IF NOT EXISTS terox;
GRANT usage ON schema terox TO terox_admin;

-- Tabla de Identidad Fiscal
CREATE TABLE terox.identidad_fiscal (
	cuil INT PRIMARY KEY,
	nombre_completo TEXT NOT NULL,
	domicilio_fiscal TEXT NOT NULL,
);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS terox.usuarios (
	username TEXT PRIMARY KEY,
	password_hash TEXT NOT NULL,
	nombre TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
	cuil INT REFERENCES terox.identidad_fiscal(cuil) CHECK (cuil ~ '^[0-9]{11}$')
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS terox.productos (
	producto_id SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	precio INT NOT NULL CHECK (precio >= 0),
	stock INT NOT NULL CHECK (stock >= 0),
	descripcion TEXT,
	rating INT CHECK (rating >= 0) DEFAULT 0,
	ventas INT NOT NULL DEFAULT 0,
	username TEXT NOT NULL REFERENCES terox.usuarios(username) ON DELETE CASCADE
);


-- Tabla de Imágenes
-- url es relativa a alguna carpeta base de imágenes
CREATE TABLE IF NOT EXISTS terox.imagenes(
	imagen_id SERIAL PRIMARY KEY,
	producto_id INT REFERENCES terox.productos(producto_id) ON DELETE CASCADE,
	url TEXT NOT NULL
);

--CREATE TABLE IF NOT EXISTS terox.pedidos/facturas(
--	-rating: int entre 0 y 5, podría ser -1 (si no se vota)
--	el rating se usa para calcular AVG al mostrar un usuario en la interfaz, si es que se desea implementar
--	esto. La alternativa es agregar RATING a usuario, y cada vez que se realiza una "votación" de ranking,
--	se actualiza el puntaje del usuario (mucho mejor que recorrer todos los pedidos calculando un avg).
--	-cantidad, precio unitario al momento de la compra: ints. Alternativamente, guardar el precio pagado y la cantidad comprada
--	Keys:
--	-username comprador, fecha, producto_id primary key???
--	alternativamente:
--	-pedido_id: primary key
--	-fecha
--	-username comprador: foreign key
--	-producto_id: foreign key
--	-username vendedor foreign key???, podría facilitar el cálculo del AVG
--);

-- Permisos

GRANT SELECT, INSERT, UPDATE, DELETE ON terox.imagenes TO terox_admin;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE terox.imagenes_imagen_id_seq TO terox_admin;

GRANT SELECT, INSERT, UPDATE, DELETE ON terox.usuarios TO terox_admin;

GRANT SELECT, INSERT, UPDATE, DELETE ON terox.productos TO terox_admin;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE terox.productos_producto_id_seq TO terox_admin;

-- Funciones
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

-- Triggers
DROP TRIGGER IF EXISTS trigger_imagen_borrada ON terox.imagenes;

CREATE TRIGGER trigger_imagen_borrada
AFTER DELETE ON terox.imagenes
FOR EACH ROW
EXECUTE FUNCTION notificar_imagen_borrada();
