SET role TO terox_owner;
CREATE schema IF NOT EXISTS terox;
GRANT usage ON schema terox TO terox_admin;


-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS terox.usuarios (
	username TEXT PRIMARY KEY,
	password_hash TEXT NOT NULL,
	nombre TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
);

-- Tabla de Identidad Fiscal
CREATE TABLE terox.identidad_fiscal (
	cuil INT PRIMARY KEY,
	username TEXT NOT NULL REFERENCES terox.usuarios(username),
	nombre_completo TEXT NOT NULL,
	domicilio_fiscal TEXT NOT NULL,
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS terox.productos (
	producto_id SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	precio INT NOT NULL CHECK (precio >= 0),
	stock INT NOT NULL CHECK (stock >= 0),
	descripcion TEXT,
	username TEXT NOT NULL REFERENCES terox.usuarios(username) ON DELETE CASCADE
);


-- Tabla de Imágenes
-- url es relativa a alguna carpeta base de imágenes
CREATE TABLE IF NOT EXISTS terox.imagenes(
	imagen_id SERIAL PRIMARY KEY,
	producto_id INT NOT NULL REFERENCES terox.productos(producto_id) ON DELETE CASCADE,
	url TEXT NOT NULL
);

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
