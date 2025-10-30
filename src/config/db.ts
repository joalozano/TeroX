import { Pool } from "pg";

// Exportar variables de entorno ejecuntado el .sh o .bat
const pool = new Pool({
	user: process.env['DB_USER'],
	host: process.env['DB_HOST'],
	database: process.env['DB_DATABASE'],
	port: Number(process.env['DB_PORT']),
	password: process.env['DB_PASSWORD'],
});

pool.on("connect", () => {
	console.log("Conectado a TeroX");
});

export default pool;
