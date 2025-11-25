SET role TO terox_owner;
CREATE schema IF NOT EXISTS terox;
GRANT usage ON schema terox TO terox_admin;


-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS terox.usuarios (
	username TEXT PRIMARY KEY,
	password_hash TEXT NOT NULL,
	nombre TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
);

-- Tabla de Identidad Fiscal
CREATE TABLE terox.identidad_fiscal (
	cuil INT PRIMARY KEY,
	username TEXT NOT NULL REFERENCES terox.usuarios(username),
	nombre_completo TEXT NOT NULL,
	domicilio_fiscal TEXT NOT NULL,
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS terox.productos (
	producto_id SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	precio INT NOT NULL CHECK (precio >= 0),
	stock INT NOT NULL CHECK (stock >= 0),
	descripcion TEXT,
	username TEXT NOT NULL REFERENCES terox.usuarios(username) ON DELETE CASCADE
);


-- Tabla de Imágenes
-- url es relativa a alguna carpeta base de imágenes
CREATE TABLE IF NOT EXISTS terox.imagenes(
	imagen_id SERIAL PRIMARY KEY,
	producto_id INT NOT NULL REFERENCES terox.productos(producto_id) ON DELETE CASCADE,
	url TEXT NOT NULL
);

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
