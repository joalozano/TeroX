set role to terox_owner;
create schema terox;
grant usage on schema terox to terox_admin;

-- Tabla de Productos
create table terox.productos
-- Implementar
-- atributos posibles: nombre, precio, stock, descripcion, fecha_creacion, imagen_url
-- cual podría ser una buena primary key?
);

grant select, insert, update, delete on terox.productos to terox_admin;
