#!/bin/bash
echo "Considere cambiar recursos/inicializar-postgreSQL.sh para que tenga un usuario y contraseña apropiados para usar postgres con permisos de administrador."
[ -z $PGUSER ] && PGUSER="postgres" # cambiar con usuario de admin de postgres
[ -z $PGPASSWORD ] && PGPASSWORD="postgres" # cambiar con contraseña apropiada
[ -z $PGDATABASE ] && PGDATABASE="terox_db"
[ -z $PGHOST ] && PGHOST=localhost
[ -z $PGPORT ] && PGPORT=5432

# Inicializamos la base de datos
psql -U $PGUSER -d $PGDATABASE -h $PGHOST -p $PGPORT -a -f creacion-db.sql || exit
psql -U $PGUSER -d $PGDATABASE -h $PGHOST -p $PGPORT -a -f creacion-schema.sql || exit
psql -U $PGUSER -d $PGDATABASE -h $PGHOST -p $PGPORT -a -f creacion-funciones.sql || exit
psql -U $PGUSER -d $PGDATABASE -h $PGHOST -p $PGPORT -a -f dar-permisos.sql || exit
cd recursos
[ ! -e 'local.env' ] && cp 'ejemplo-local.env' 'local.env' # no existe un script con las variables de ambiente deseadas, así que copiamos el template
# cambiamos las variables de ambiente para trabajar con la base de datos sin privilegios máximos
source 'local.env'
cd ..
psql -U $DB_USER -d $DB_DATABASE -h $DB_HOST -p $DB_PORT -a -f cargar-datos-de-test.sql
