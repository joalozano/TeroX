#!/bin/bash

function die() {
	echo "Necesitás tener las variables de ambiente listas para administrar postgreSQL e inicializar la base de datos"
	echo "Un ejemplo es usar \`export PGUSER=postgres PGPASSWORD=postgres PGPORT=5432\`."
	exit
}
[ -z '$PGUSER' ] &&  [ -z '$PGPASSWORD' ] && [ -z '$PGPORT' ] && die
[ ! -e 'local.env' ] && cp 'ejemplo-local.env' 'local.env' # no existe un script con las variables de ambiente deseadas, así que copiamos el template

# Inicializamos la base de datos
PGDATABASE="" psql -a -f creacion-db.sql || exit
PGDATABASE="" psql -a -f creacion-schema.sql || exit
PGDATABASE="" psql -a -f creacion-funciones.sql || exit
PGDATABASE="" psql -a -f dar-permisos.sql || exit
# cambiamos las variables de ambiente para trabajar con la base de datos sin privilegios máximos
source 'local.env'
psql -U $PGUSER -d $PGDATABASE -h $PGHOST -p $PGPORT -a -f cargar-datos-de-test.sql
