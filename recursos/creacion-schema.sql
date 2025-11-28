SET role TO terox_owner;
CREATE schema IF NOT EXISTS terox;
GRANT usage ON schema terox TO terox_admin;


-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS terox.usuarios (
	username TEXT PRIMARY KEY,
	password_hash TEXT NOT NULL,
	nombre TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL
);

-- Tabla de Identidad Fiscal
CREATE TABLE terox.identidad_fiscal (
	cuil BIGINT PRIMARY KEY,
	username TEXT UNIQUE REFERENCES terox.usuarios(username) ON DELETE SET NULL ON UPDATE CASCADE,
	nombre_completo TEXT NOT NULL,
	domicilio_fiscal TEXT NOT NULL
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS terox.productos (
	producto_id SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	precio INT CHECK (precio > 0),
	stock INT CHECK (stock >= 0),
	descripcion TEXT,
	username TEXT REFERENCES terox.usuarios(username) ON UPDATE CASCADE ON DELETE CASCADE,
	rating INT CHECK (rating >= 0 AND rating <= 5) DEFAULT 0,
	cantidad_rating INT CHECK (cantidad_rating >= 0) DEFAULT 0
);


-- Tabla de Imágenes
-- url es relativa a alguna carpeta base de imágenes
CREATE TABLE IF NOT EXISTS terox.imagenes(
	imagen_id SERIAL PRIMARY KEY,
	producto_id INTEGER REFERENCES terox.productos(producto_id) ON DELETE CASCADE,
	url TEXT NOT NULL
);

-- Tabla de Ordenes
CREATE TABLE IF NOT EXISTS terox.ordenes (
    orden_id SERIAL PRIMARY KEY,

    producto_id INTEGER REFERENCES terox.productos(producto_id) ON DELETE SET NULL,
    producto_nombre TEXT NOT NULL,
    comprador_username TEXT REFERENCES terox.usuarios(username) ON DELETE SET NULL ON UPDATE CASCADE,
    vendedor_username TEXT REFERENCES terox.usuarios(username) ON DELETE SET NULL ON UPDATE CASCADE,

    direccion_entrega TEXT NOT NULL,

    cantidad_pedida INT CHECK (cantidad_pedida > 0),
    precio_unitario INT CHECK (precio_unitario > 0),

    estado_de_entrega VARCHAR(32) NOT NULL CHECK (
    estado_de_entrega IN ('esperando_producto_vendedor',
                            'producto_en_centro_distribucion',
                            'entregado_al_comprador',
			    'entrega_cancelada'
	)
    ) DEFAULT 'esperando_producto_vendedor',
    rating INT CHECK (rating >= 0 AND rating <= 5) DEFAULT 0
);

-- Tabla de Facturas
CREATE TABLE IF NOT EXISTS terox.facturas (
    factura_id SERIAL PRIMARY KEY,
    orden_id INTEGER REFERENCES terox.ordenes(orden_id),
    comprador_cuil BIGINT REFERENCES terox.identidad_fiscal(cuil) ON UPDATE CASCADE,
    comprador_nombre_completo TEXT NOT NULL,
    comprador_domicilio_fiscal TEXT NOT NULL,
    vendedor_cuil BIGINT REFERENCES terox.identidad_fiscal(cuil) ON UPDATE CASCADE,
    vendedor_nombre_completo TEXT NOT NULL,
    vendedor_domicilio_fiscal TEXT NOT NULL
);

-- Tabla de Pagos a vendedores
CREATE TABLE IF NOT EXISTS terox.pagos (
	pago_id SERIAL PRIMARY KEY,
	orden_id INTEGER REFERENCES terox.ordenes(orden_id),
	cuil BIGINT REFERENCES terox.identidad_fiscal(cuil) ON UPDATE CASCADE,
	nombre_completo TEXT NOT NULL,
	domicilio_fiscal TEXT NOT NULL,
	monto INT CHECK (monto > 0),
	motivo TEXT NOT NULL
);
