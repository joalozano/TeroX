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
import rating_routes from "./rating-routes";
import { requireAuthAPI, replacePasswordForHash } from "../middlewares/middlewares-auth";
import { verificar_usuario_es_dueño_del_producto, añadir_username_a_request, verificar_usuario_tiene_identidad_fiscal } from "../middlewares/middlewares-productos";
import { FiltroLike, FiltroSimple, FiltroUsernameNotNull } from "../types/queryfilters";
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
		new FiltroLike("like", ["nombre", "descripcion"]),
		new FiltroUsernameNotNull()
	];

	const atributos_producto_get = atributos_producto;
	const atributos_producto_post = atributos_producto.filter(
		attr => attr !== "producto_id" && attr !== "rating" && attr !== "cantidad_rating"
	);
	const atributos_productos_put = atributos_producto.filter(
		attr => attr !== "producto_id" && attr !== "username" && attr !== "rating" && attr !== "cantidad_rating"
	);

	router.use("/api", generarCRUD("/productos", "producto_id",
		atributos_producto_get, atributos_producto_post, atributos_productos_put,
		middlewares_producto, query_params_get_producto)
	);

	const middlewares_usuarios: MiddlewareCRUD = {
		get: [(_, res, __) => { res.sendStatus(403); }],
		post: [replacePasswordForHash],
		put: [requireAuthAPI],
		delete: [requireAuthAPI]
	};

	const atributos_usuario_get = atributos_usuario.filter(attr => attr !== "password_hash");
	const atributos_usuario_post = atributos_usuario;
	const atributos_usuario_put = atributos_usuario.filter(attr => attr !== "username" && attr !== "password_hash");

	router.use("/api", generarCRUD("/usuarios", "username",
		atributos_usuario_get, atributos_usuario_post, atributos_usuario_put,
		middlewares_usuarios, [])
	);


	router.use("/api", generarEndPointIdFiscal("/identidad_fiscal", "cuil", atributos_identidad_fiscal));
	router.use("/api", orden_routes);
	router.use("/api/auth", auth_api);
	router.use("/api", rating_routes);
	router.use("/", imagenes_routes);


	router.use("/", productos_views);
	router.use("/", identidad_fiscal_views);
	router.use("/", user_session_views);
	router.use("/", ordenes_view);

	return router;
}
