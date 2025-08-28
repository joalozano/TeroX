create user terox_owner nologin;
create user terox_admin password 'cambiar_esta_clave';

create database terox_db owner terox_owner;
grant connect on database terox_db to terox_admin;
