import { Pool } from "pg";

// Exportar variables de entorno ejecuntado el .sh o .bat
const pool = new Pool({
	user: process.env['PGUSER'],
	host: process.env['PGHOST'],
	database: process.env['PGDATABASE'],
	port: Number(process.env['PGPORT']),
	password: process.env['PGPASSWORD'],
});

pool.on("connect", () => {
	console.log("Conectado a TeroX");
});

export default pool;
