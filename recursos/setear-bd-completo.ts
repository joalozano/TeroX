import { Client } from 'pg';

async function crearEsquema() {
    const client = new Client();

    try {
        await client.connect();
        console.log('✅ Conectado a terox_db como terox_admin');

        // Establecer rol a terox_owner
        //await client.query('SET ROLE TO terox_owner');
        //console.log('✅ Rol establecido a terox_owner');

        //// Crear schema
        //await client.query('CREATE SCHEMA terox');
        //console.log('✅ Schema terox creado');

        //// Conceder permisos en el schema
        //await client.query('GRANT USAGE ON SCHEMA terox TO terox_admin');
        //console.log('✅ Permisos de uso concedidos en schema terox');

        // Crear tabla productos
        await client.query(`
            CREATE TABLE terox.productos (
                producto_id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                precio INT NOT NULL CHECK (precio >= 0),
                stock INT NOT NULL CHECK (stock >= 0),
                descripcion TEXT,
                imagen_url VARCHAR(255)
            )
        `);
        console.log('✅ Tabla productos creada');

        // Conceder permisos en la tabla
        await client.query('GRANT SELECT, INSERT, UPDATE, DELETE ON terox.productos TO terox_admin');
        console.log('✅ Permisos concedidos en tabla productos');

        // Conceder permisos en la secuencia
        await client.query('GRANT USAGE, SELECT ON SEQUENCE terox.productos_producto_id_seq TO terox_admin');
        console.log('✅ Permisos concedidos en secuencia');

    } catch (error) {
        console.error('❌ Error creando esquema:', error);
        throw error;
    } finally {
        await client.end();
    }
}

async function insertarProductos(producto: string) {
    const client = new Client();
    await client.connect();

    await client.query(producto);
    await client.end();
}
//crearEsquema();
const producto: string = `INSERT INTO terox.productos (nombre,precio,stock,descripcion,imagen_url)VALUES ('Big Dipper', '20', '1', 'Goma Pegajosa de Tenis de Mesa, con tecnología MaxTense', 'big_dipper.avif'`
insertarProductos(producto);

