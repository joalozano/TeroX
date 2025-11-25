-- entregar permisos para todo el schema
GRANT SELECT, INSERT, UPDATE, DELETE ON terox.imagenes TO terox_admin;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE terox.imagenes_imagen_id_seq TO terox_admin;

GRANT SELECT, INSERT, UPDATE, DELETE ON terox.usuarios TO terox_admin;

GRANT SELECT, INSERT, UPDATE, DELETE ON terox.productos TO terox_admin;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE terox.productos_producto_id_seq TO terox_admin;

GRANT SELECT, INSERT, UPDATE, DELETE ON terox.ordenes TO terox_admin;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE terox.ordenes_orden_id_seq TO terox_admin;

GRANT SELECT, INSERT, UPDATE, DELETE ON terox.facturas TO terox_admin;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE terox.facturas_factura_id_seq TO terox_admin;

GRANT SELECT, INSERT, UPDATE, DELETE ON terox.identidad_fiscal TO terox_admin;
