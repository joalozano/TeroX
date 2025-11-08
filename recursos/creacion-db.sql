CREATE USER terox_owner nologin;
CREATE USER terox_admin password 'cambiar_esta_clave';

CREATE database terox_db owner terox_owner;
GRANT CONNECT ON database terox_db TO terox_admin;
