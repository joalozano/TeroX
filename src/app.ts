import express from "express";
import rutas_de_productos from "./routes/productos";
import pool from "./config/db.ts";

const app = express();

app.use(express.json());
app.set('view engine', 'ejs')

app.use("/productos", rutas_de_productos);

app.listen(3000, () => {
	console.log("Servidor iniciado en http://localhost:3000");
});

