set role to terox_owner;
create schema terox;
grant usage on schema terox to terox_admin;

-- Tabla de Usuarios
CREATE TABLE terox.usuarios (
    username TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

-- Tabla de Productos
CREATE table terox.productos (
    producto_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio INT NOT NULL CHECK (precio >= 0),
    stock INT NOT NULL CHECK (stock >= 0),
    descripcion TEXT,
    username TEXT NOT NULL REFERENCES terox.usuarios(username) ON DELETE CASCADE
);


-- Tabla de Imágenes
-- url es relativa a alguna carpeta base de imágenes
CREATE TABLE terox.imagenes(
    imagen_id SERIAL PRIMARY KEY,
    producto_id INT REFERENCES terox.productos(producto_id) ON DELETE CASCADE,
    url TEXT NOT NULL
);

-- Permisos

GRANT SELECT, INSERT, UPDATE, DELETE ON terox.imagenes TO terox_admin;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE terox.imagenes_imagen_id_seq TO terox_admin;

GRANT SELECT, INSERT, UPDATE, DELETE ON terox.usuarios TO terox_admin;

GRANT SELECT, INSERT, UPDATE, DELETE ON terox.productos TO terox_admin;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE terox.productos_producto_id_seq TO terox_admin;
