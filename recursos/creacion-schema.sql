set role to terox_owner;
create schema terox;
grant usage on schema terox to terox_admin;

-- Tabla de Productos
create table terox.productos (
    producto_id serial primary key,
    nombre varchar(100) not null,
    precio int not null check (precio >= 0),
    stock int not null check (stock >= 0),
    descripcion text,
    imagen_url varchar(255)
);

grant select, insert, update, delete on terox.productos to terox_admin;
