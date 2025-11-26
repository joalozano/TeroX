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
	cuil INT PRIMARY KEY,
	username TEXT NOT NULL UNIQUE REFERENCES terox.usuarios(username),
	nombre_completo TEXT NOT NULL,
	domicilio_fiscal TEXT NOT NULL
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
    producto_nombre TEXT NOT NULL,
    comprador_username TEXT NOT NULL REFERENCES terox.usuarios(username),
    vendedor_username TEXT NOT NULL REFERENCES terox.usuarios(username),

    direccion_entrega TEXT NOT NULL,

    cantidad_pedida INT NOT NULL CHECK (cantidad_pedida > 0),
    precio_unitario INT NOT NULL CHECK (precio_unitario >= 0),

    estado_de_entrega VARCHAR(30) NOT NULL CHECK (
        estado_de_entrega IN ('esperando_producto_vendedor',
                            'producto_en_centro_distribucion',
                            'entregado_al_comprador')
    ),
    rating INT CHECK (rating >= 0 AND rating <= 5),

    factura_id INT NOT NULL REFERENCES terox.facturas(factura_id)

);

-- Tabla de Facturas
CREATE TABLE terox.facturas (
    factura_id SERIAL PRIMARY KEY,
    comprador_identidad_fiscal_id BIGINT NOT NULL REFERENCES terox.identidad_fiscal(cuil),
	comprador_nombre_completo TEXT NOT NULL,
	comprador_domicilio_fiscal TEXT NOT NULL,
    vendedor_identidad_fiscal_id BIGINT NOT NULL REFERENCES terox.identidad_fiscal(cuil),
	vendedor_nombre_completo TEXT NOT NULL,
	vendedor_domicilio_fiscal TEXT NOT NULL
);
