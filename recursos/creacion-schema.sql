set role to terox_owner;
create schema terox;
grant usage on schema terox to terox_admin;

-- Tabla de Usuarios
CREATE TABLE terox.usuarios (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
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
    usuario_id INT NOT NULL REFERENCES terox.usuarios(usuario_id) ON DELETE CASCADE
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

-- modificar tablas viejas

alter table terox.usuarios rename column id to usuario_id;
alter table terox.productos add column usuario_id int;
update terox.productos set usuario_id = "un numero que quieras"    
alter table terox.productos add constraint productos_usuario_id_fkey foreign key (usuario_id) references terox.usuarios (usuario_id) on delete cascade;
alter table terox.productos alter column usuario_id set not null


alter table terox.productos drop column imagen_url