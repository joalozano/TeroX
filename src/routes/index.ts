import { Router } from "express";
import generarCRUD from "./crud-api";
import productos_routes from "./productos";
import auth_api from "./auth-api";
import productos_views from "./productos-views";
import identidad_fiscal_views from "./identidad-fiscal-views";
import generarEndPointIdFiscal from "./identidad-fiscal";
import user_session_views from "./user-sesion-views";
import imagenes_routes from "./images-routes";
import orden_routes from "./orden";
import { requireAuthAPI, replacePasswordForHash, cantChangePassword } from "../middlewares/middlewares-auth";
import { verificar_usuario_es_dueño_del_producto, añadir_username_a_request } from "../middlewares/middlewares-productos";
import { FiltroSimple } from "../types/queryfilters";
import { executeQuery } from "../services/queryExecutor";

const router = Router();

async function obtenerNombresTablas(tabla: string) {
	const query_metadata = "SELECT column_name FROM information.columns WHERE table_schema='terox' AND table_name=$1";
	const res = await executeQuery(query_metadata, [tabla], '');
	const nombres = res.rows.map(r => r.column_name);
	return nombres;
}

let atributos_producto!: string[];
let atributos_usuario!: string[];
let atributos_identidad_fiscal!: string[];

(async () => {
	atributos_producto = await obtenerNombresTablas("productos");
	atributos_usuario = await obtenerNombresTablas("usuarios");
	atributos_identidad_fiscal = await obtenerNombresTablas("identidad_fiscal");
});

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

const middlewares_usuarios: MiddlewareCRUD = {
	get: [(_, res, __) => { res.sendStatus(403); }],
	post: [replacePasswordForHash],
	put: [requireAuthAPI, cantChangePassword],
	delete: [requireAuthAPI]
};

router.use("/api", generarCRUD("/usuarios", "username", atributos_usuario, middlewares_usuarios, [], false));


router.use("/api", generarEndPointIdFiscal("/identidad_fiscal", "cuil", atributos_identidad_fiscal));
router.use("/api", orden_routes);
router.use("/api/auth", auth_api);
router.use("/", imagenes_routes);


router.use("/", productos_views);
router.use("/", identidad_fiscal_views);
router.use("/", user_session_views);

export default router;
