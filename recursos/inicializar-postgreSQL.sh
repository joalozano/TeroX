#!/bin/sh
[ -z $PGUSER && -z $PGPASSWORD &&  -z $PGHOST && -z $PGPORT ] && \
echo "Necesitás tener las variables de ambiente listas para administrar postgreSQL e inicializar la base de datos" && \
echo "Un ejemplo es usar \`export PGUSER=postgres PGPASSWORD=postgres PGHOST=localhost PGPORT=5432\`." && \
exit
[ ! -e local-envvars-unix.sh ] && cp ejemplo-local-envvars-unix.sh local-envvars-unix.sh # no existe un script con las variables de ambiente deseadas, así que copiamos el template

# Inicializamos la base de datos
psql -U $PGUSER -h $PGHOST -p $PGPORT -a -f creacion-db.sql
eval $(grep DATABASE local-envvars-unix.sh) # cambiamos el valor de PGDATABASE a la base de datos deseada
psql -U $PGUSER -d $PGDATABASE -h $PGHOST -p $PGPORT -a -f creacion-schema.sql
./local-envvars-unix.sh # cambiamos las variables de ambiente para trabajar con la base de datos sin privilegios máximos
psql -U $PGUSER -d $PGDATABASE -h $PGHOST -p $PGPORT -a -f cargar-datos-de-test.sql
