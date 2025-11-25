#!/bin/bash

[ -z $PGUSER ] && PGUSER="postgres"
[ -z $PGPASSWORD ] && PGPASSWORD="postgres"
[ -z $PGDATABASE ] && PGDATABASE="terox_db"
[ -z $PGHOST ] && PGHOST=localhost
[ -z $PGPORT ] && PGPORT=5432

function die() {
	echo "Necesitás tener las variables de ambiente listas para administrar postgreSQL e inicializar la base de datos"
	echo "Un ejemplo es usar \`export PGUSER=postgres PGPASSWORD=postgres PGPORT=5432\`."
}
die

# Inicializamos la base de datos
psql -U $PGUSER -d $PGDATABASE -h $PGHOST -p $PGPORT -a -f creacion-db.sql || exit
psql -U $PGUSER -d $PGDATABASE -h $PGHOST -p $PGPORT -a -f creacion-schema.sql || exit
psql -U $PGUSER -d $PGDATABASE -h $PGHOST -p $PGPORT -a -f creacion-funciones.sql || exit
psql -U $PGUSER -d $PGDATABASE -h $PGHOST -p $PGPORT -a -f dar-permisos.sql || exit
[ ! -e 'local.env' ] && cp 'ejemplo-local.env' 'local.env' # no existe un script con las variables de ambiente deseadas, así que copiamos el template
# cambiamos las variables de ambiente para trabajar con la base de datos sin privilegios máximos
source 'local.env'
psql -U $DB_USER -d $DB_DATABASE -h $DB_HOST -p $DB_PORT -a -f cargar-datos-de-test.sql
