import express from "express";
import productos_api from "./routes/productos-api";
import productos_views from "./routes/productos-views";

const app = express();

app.use(express.json());
app.set('view engine', 'ejs')

app.use(express.static('public'));

app.use("/api", productos_api);
app.use("/", productos_views);

app.get("/", async (_, res) => {
	res.render('index');
});

app.listen(3000, () => {
	console.log("Servidor iniciado en http://localhost:3000");
});

