import express from "express";
import routes from "./routes/index";
import path from "path";
import session from "express-session";
import sessionConfig from "./config/session";
import errorHandler from "./middlewares/middlewares-error-handler";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views"));

app.use(express.json());
app.use(express.static("public"));
app.use(session(sessionConfig));

app.use(routes);
app.use(errorHandler);

app.get("/", async (_, res) => {
    res.render('index');
});

app.listen(3001, () => {
    console.log("Servidor iniciado en http://localhost:3001");
});
