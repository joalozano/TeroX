import { Router } from "express";
import generarCRUD from "./crud-api";
import productos_routes from "./productos";
import auth_api from "./auth-api";
import productos_views from "./productos-views";
import identidad_fiscal_views from "./identidad-fiscal-views";
import identidad_fiscal from "./identidad-fiscal";
import user_session_views from "./user-sesion-views";
import imagenes_routes from "./images-routes";
import { requireAuthAPI, replacePasswordForHash, cantChangePassword } from "../middlewares/middlewares-auth";
import { verificar_usuario_es_dueño_del_producto, añadir_username_a_request } from "../middlewares/middlewares-productos";
//import { requiere_usuario_es_dueño_de_identidad_fiscal } from "../middlewares/middlewares-id-fiscal";
import { requiere_usuario_aparece_en_orden, validar_tarjeta, requiere_identidades_fiscales_para_compra } from "../middlewares/middlewares-compras";
import { HttpError } from "../types/http-error";
import { HttpError } from "../types/http-error";
import { FiltroSimple } from "../types/queryfilters";

const router = Router();

/*async function obtener_nombresTablas(tabla: string) {
	const query_metadata = "SELECT column_name FROM information.columns WHERE table_schema='terox' AND table_name=$1";
	const res = await executeQuery(query_metadata, [tabla], '');
	return res.rows.map(r => r.column_name);
}*/

const atributos_producto = ["producto_id", "nombre", "descripcion", "precio", "stock", "username"];
//const atributos_producto = await obtener_nombresTablas("productos");
const middlewares_producto: MiddlewareCRUD = {
    get: [],
    post: [requireAuthAPI, añadir_username_a_request],
    put: [requireAuthAPI, añadir_username_a_request, verificar_usuario_es_dueño_del_producto],
    delete: [requireAuthAPI, verificar_usuario_es_dueño_del_producto]
};

const query_params_get_producto = [
    new FiltroSimple("producto_id"),
    new FiltroSimple("username")
];

router.use("/api", generarCRUD("/productos", "producto_id", atributos_producto, middlewares_producto, query_params_get_producto, true));
router.use("/api", productos_routes);

const atributos_usuario = ["username", "password_hash", "nombre", "email"];
//const atributos_usuario = await obtener_nombresTablas("usuarios");
const middlewares_usuarios: MiddlewareCRUD = {
    get: [(_, res, __) => { res.sendStatus(403); }],
    post: [replacePasswordForHash],
    put: [requireAuthAPI, cantChangePassword],
    delete: [requireAuthAPI]
};

router.use("/api", generarCRUD("/usuarios", "username", atributos_usuario, middlewares_usuarios, [], false));


//const atributos_identidad_fiscal = ["cuil", "nombre_completo", "domicilio_fiscal", "username"];
//const middlewares_identidad_fiscal: MiddlewareCRUD = {
//    get: [requireAuthAPI, requiere_usuario_es_dueño_de_identidad_fiscal],
//    post: [requireAuthAPI, añadir_username_a_request],
//    put: [requireAuthAPI, requiere_usuario_es_dueño_de_identidad_fiscal],
//    delete: [() => { throw new Error("No se permite eliminar la identidad fiscal"); }]
//};

router.use("/api", identidad_fiscal);


const atributos_orden = ["orden_id", "producto_id", "comprador_username", "vendedor_username", "cantidad_pedida",
    "precio_unitario", "estado_de_entrega", "rating"];
const middlewares_orden: MiddlewareCRUD = {
    get: [requireAuthAPI, requiere_usuario_aparece_en_orden],
    post: [requireAuthAPI, validar_tarjeta, requiere_identidades_fiscales_para_compra],
    put: [requireAuthAPI, requiere_usuario_aparece_en_orden],
    delete: [() => { throw new HttpError(403, "No se puede eliminar una orden, puede cancelarla")} ]
};

router.use("/api", generarCRUD("/ordenes", "orden_id", atributos_orden, middlewares_orden, [], true));


router.use("/api/auth", auth_api);
router.use("/", imagenes_routes);


router.use("/", productos_views);
router.use("/", identidad_fiscal_views);
router.use("/", user_session_views);

export default router;
