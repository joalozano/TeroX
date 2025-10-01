import express from "express";
import rutas_de_productos from "./routes/productos";
//import pool from "./config/db";

const app = express();

app.use(express.json());
app.set('view engine', 'ejs')

app.use(express.static('imagenes-productos'));

app.use("/productos", rutas_de_productos);

app.get("/", async (_, res) => {
	res.render('index');
});

app.listen(3000, () => {
	console.log("Servidor iniciado en http://localhost:3000");
});

