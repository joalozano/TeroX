#!/bin/sh
# [ -z $PGUSER && -z $PGPASSWORD && -z $PGDATABASE && -z $PGHOST && -z $PGPORT ] && echo "Recuerde establecer las variables PGUSER, PGPASSWORD, PGDATABASE, PGHOST y PGPORT para utilizar postgreSQL." && exit
./ejemplo-local-envvars-unix.sh # Para dev, setea variables básicas

# Corremos los distintos scripts para tener la BD inicializada y con casos de test para trabajar con la aplicación
psql -U $PGUSER -d $PGDATABASE -h $PGHOST -p $PGPORT -a -f creacion-db.sql
psql -U $PGUSER -d $PGDATABASE -h $PGHOST -p $PGPORT -a -f creacion-schema.sql
psql -U $PGUSER -d $PGDATABASE -h $PGHOST -p $PGPORT -a -f cargar-datos-de-test.sql
