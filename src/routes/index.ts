import { Router } from "express";
import generarCRUD from "./crud-api";
import auth_api from "./auth-api";
import productos_views from "./productos-views";
import identidad_fiscal_views from "./identidad-fiscal-views";
import generarEndPointIdFiscal from "./identidad-fiscal";
import user_session_views from "./user-sesion-views";
import imagenes_routes from "./images-routes";
import orden_routes from "./orden";
import ordenes_view from "./ordenes-view";
import { requireAuthAPI, replacePasswordForHash, cantChangePassword, requireParamIgualAUsuarioLogueado } from "../middlewares/middlewares-auth";
import { verificar_usuario_es_dueño_del_producto, añadir_username_a_request, verificar_usuario_tiene_identidad_fiscal } from "../middlewares/middlewares-productos";
import { FiltroLike, FiltroSimple } from "../types/queryfilters";
import { atributos_producto, atributos_usuario, atributos_identidad_fiscal } from "../config/estructuras";

export default function generarRoutes() {
	const router = Router();

	const middlewares_producto: MiddlewareCRUD = {
		get: [],
		post: [requireAuthAPI, verificar_usuario_tiene_identidad_fiscal, añadir_username_a_request],
		put: [requireAuthAPI, añadir_username_a_request, verificar_usuario_es_dueño_del_producto],
		delete: [requireAuthAPI, verificar_usuario_es_dueño_del_producto]
	};

	const query_params_get_producto = [
		new FiltroSimple("producto_id"),
		new FiltroSimple("username"),
		new FiltroLike("like", ["nombre", "descripcion"])
	];

	router.use("/api", generarCRUD("/productos", "producto_id", atributos_producto, middlewares_producto, query_params_get_producto, true));
    const query_params_get_usuario = [
        new FiltroSimple("username")
    ]
const middlewares_usuarios: MiddlewareCRUD = {
    get: [requireAuthAPI, requireParamIgualAUsuarioLogueado],
    post: [replacePasswordForHash],
    put: [requireAuthAPI, cantChangePassword],
    delete: [requireAuthAPI]
};

	router.use("/api", generarCRUD("/usuarios", "username", atributos_usuario, middlewares_usuarios, query_params_get_usuario, false));


	router.use("/api", generarEndPointIdFiscal("/identidad_fiscal", "cuil", atributos_identidad_fiscal));
	router.use("/api", orden_routes);
	router.use("/api/auth", auth_api);
	router.use("/", imagenes_routes);


	router.use("/", productos_views);
	router.use("/", identidad_fiscal_views);
	router.use("/", user_session_views);
	router.use("/", ordenes_view);

	return router;
}
