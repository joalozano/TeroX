import express from "express";
import rutas_de_productos from "./routes/productos";

const app = express();

app.use(express.json());
app.use("/productos", rutas_de_productos);

