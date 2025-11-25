-- Tabla de Ordenes
CREATE TABLE terox.ordenes (
    orden_id SERIAL PRIMARY KEY,

    producto_id INT NOT NULL REFERENCES terox.productos(producto_id),
    comprador_username TEXT NOT NULL REFERENCES terox.usuarios(username),
    vendedor_username TEXT NOT NULL REFERENCES terox.usuarios(username),

    direccion_entrega TEXT NOT NULL,

    cantidad_pedida INT NOT NULL CHECK (quantity > 0),
    precio_unitario INT NOT NULL CHECK (precio_unitario >= 0),

    estado_de_pago VARCHAR(20) NOT NULL CHECK (
        estado_de_pago IN ('pendiente', 'pagado', 'rechazado')
    ),

    estado_de_entrega VARCHAR(30) NOT NULL CHECK (
        estado_de_entrega IN ('esperando_producto_vendedor',
                            'producto_en_centro_distribucion',
                            'entregado_al_comprador')
    ),

);

-- Tabla de Facturas
CREATE TABLE terox.facturas (
    factura_id SERIAL PRIMARY KEY,
    orden_id BIGINT NOT NULL REFERENCES terox.ordenas(orden_id), -- esta podria ser la primary key tambien
    comprador_identidad_fiscal_id BIGINT NOT NULL REFERENCES billing_identity(id),
    vendedor_identidad_fiscal_id BIGINT NOT NULL REFERENCES billing_identity(id),
);

-- Tabla de Ratings
CREATE TABLE terox.ratings (
    orden_id INT NOT NULL,
    producto_id INT NOT NULL,

    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comentario TEXT,

    PRIMARY KEY (orden_id, producto_id),

    CONSTRAINT fk_rating_orden
        FOREIGN KEY (orden_id)
        REFERENCES terox.ordenes(orden_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rating_producto
        FOREIGN KEY (producto_id)
        REFERENCES terox.productos(producto_id)
        ON DELETE CASCADE
);

-- Funciones
CREATE OR REPLACE FUNCTION notificar_orden_aceptada()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.estado_de_pago = 'pagado' THEN
		PERFORM pg_notify('orden_aceptada', id_aceptada);

		RETURN OLD.orden_id;
	END IF;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS trigger_orden_aceptada ON terox.ordenes;

CREATE TRIGGER trigger_orden_aceptada
AFTER UPDATE ON terox.ordenes
FOR EACH ROW
EXECUTE FUNCTION notificar_orden_aceptada();

-- Permisos
GRANT SELECT, INSERT, UPDATE, DELETE ON terox.ordenes TO terox_admin;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE terox.ordenes_orden_id_seq TO terox_admin;

GRANT SELECT, INSERT, UPDATE, DELETE ON terox.facturas TO terox_admin;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE terox.facturas_factura_id_seq TO terox_admin;

GRANT SELECT, INSERT, UPDATE, DELETE ON terox.ratings TO terox_admin;
