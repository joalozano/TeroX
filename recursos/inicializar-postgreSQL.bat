REM archivo generado pasandole el script inicializar-postgreSQL.sh a ChatGPT y cambiando local.env por local.bat
@echo off
echo Considere cambiar recursos/inicializar-postgreSQL.sh para que tenga un usuario y contraseña apropiados para usar postgres con permisos de administrador.

REM Establecer valores por defecto si no se han definido las variables
IF "%PGUSER%"=="" SET PGUSER=postgres
IF "%PGPASSWORD%"=="" SET PGPASSWORD=postgres
IF "%PGDATABASE%"=="" SET PGDATABASE=terox_db
IF "%PGHOST%"=="" SET PGHOST=localhost
IF "%PGPORT%"=="" SET PGPORT=5432

cd recursos
REM Inicializamos la base de datos
psql -U %PGUSER% -d %PGDATABASE% -h %PGHOST% -p %PGPORT% -a -f creacion-db.sql || exit /b
psql -U %PGUSER% -d %PGDATABASE% -h %PGHOST% -p %PGPORT% -a -f creacion-schema.sql || exit /b
psql -U %PGUSER% -d %PGDATABASE% -h %PGHOST% -p %PGPORT% -a -f funciones.sql || exit /b
psql -U %PGUSER% -d %PGDATABASE% -h %PGHOST% -p %PGPORT% -a -f dar-permisos.sql || exit /b

REM Cambiar las variables de entorno
IF NOT EXIST "local.bat" copy "ejemplo-local.bat" "local.bat" REM Copiar el template si no existe el archivo local.env
call local.bat

psql -U %DB_USER% -d %DB_DATABASE% -h %DB_HOST% -p %DB_PORT% -a -f cargar-datos-de-test.sql
cd ..
