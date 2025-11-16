import { Router } from "express";
import generarCRUD from "./crud-api";
import productos_routes from "./productos";
import auth_api from "./auth-api";
import productos_views from "./productos-views";
import user_session_views from "./user-sesion-views";
import imagenes_routes from "./images-routes";
import { requireAuthAPI, replacePasswordForHash, cantChangePassword } from "../middlewares/middlewares-auth";
import { verificar_usuario_es_dueño_del_producto, añadir_username_a_request } from "../middlewares/middlewares-productos";

const router = Router();

const atributos_producto = ["producto_id", "nombre", "descripcion", "precio", "stock", "username"];
const middlewares_producto: MiddlewareCRUD = {
    get: [],
    post: [requireAuthAPI, añadir_username_a_request],
    put: [requireAuthAPI, añadir_username_a_request, verificar_usuario_es_dueño_del_producto],
    delete: [requireAuthAPI, verificar_usuario_es_dueño_del_producto]
};

router.use("/api", generarCRUD("/productos", "producto_id", atributos_producto, middlewares_producto, ["producto_id", "username"], true));
router.use("/api", productos_routes);

const atributos_usuario = ["username", "password_hash", "nombre", "email"];
const middlewares_usuarios: MiddlewareCRUD = {
    get: [(_, res, __) => { res.sendStatus(403); }],
    post: [replacePasswordForHash],
    put: [requireAuthAPI, cantChangePassword],
    delete: [requireAuthAPI]
};

router.use("/api", generarCRUD("/usuarios", "username", atributos_usuario, middlewares_usuarios, [], false));
router.use("/api/auth", auth_api);
router.use("/", imagenes_routes);


router.use("/", productos_views);
router.use("/", user_session_views);

export default router;
