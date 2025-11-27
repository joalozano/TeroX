-- borrar esquema fácilmente para luego correr inicializarPostgreSQL.sh
DROP SCHEMA terox CASCADE;
-- borrar funciones y triggers creados, con cuidado
DROP FUNCTION notificar_imagen_borrada CASCADE;
DROP FUNCTION procesar_producto_usuario_borrado CASCADE;
DROP FUNCTION registrar_pago CASCADE;
