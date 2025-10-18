set role to terox_owner;
create schema terox;
grant usage on schema terox to terox_admin;

-- Tabla de Productos
create table terox.productos (
    producto_id serial primary key,
    nombre varchar(100) not null,
    precio int not null check (precio >= 0),
    stock int not null check (stock >= 0),
    descripcion text
--    usuario_id REFERENCES terox.usuarios(id) -- FK a usuarios, para relacionar un producto/post con su publicador
);

CREATE TABLE terox.usuarios (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

-- Tabla de Imágenes
-- url es relativa a alguna carpeta base de imágenes
CREATE TABLE terox.imagenes(
    id SERIAL PRIMARY KEY,
    producto_id INT REFERENCES terox.productos(producto_id) ON DELETE CASCADE,
    url TEXT NOT NULL
);

-- Permisos

grant select, insert, update, delete on terox.imagenes to terox_admin;
grant select, insert, update, delete on terox.imagenes_id_seq to terox_admin;

grant select, insert, update, delete on terox.usuarios to terox_admin;
grant select, insert, update, delete on terox.usuarios_id_seq to terox_admin;

grant select, insert, update, delete on terox.productos to terox_admin;
grant select, insert, update, delete on terox.productos_producto_id_seq to terox_admin;
