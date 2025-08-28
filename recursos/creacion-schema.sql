set role to terox_owner;
create schema terox;
grant usage on schema terox to terox_admin;

/*create table terox.alumnos ( -- definir el producto antes de crear una tabla
    lu text primary key,
    apellido text not null,
    nombres text not null,
    titulo text,
    titulo_en_tramite date,
    egreso date
);

grant select, insert, update, delete on terox.alumnos to terox_admin;*/
