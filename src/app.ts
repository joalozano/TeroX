import express from "express";
import generarCRUD from "./routes/productos-api";
import productos_views from "./routes/productos-views";

const app = express();

app.use(express.json());
app.set('view engine', 'ejs')

app.use(express.static('public'));

const atributos_producto = ["nombre", "descripcion", "precio", "imagen_url", "stock"];
app.use("/api", generarCRUD("/productos", "producto_id", atributos_producto));
app.use("/", productos_views);

app.get("/", async (_, res) => {
	res.render('index');
});

app.listen(3000, () => {
	console.log("Servidor iniciado en http://localhost:3000");
});

