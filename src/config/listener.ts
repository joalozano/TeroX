import { listener } from "./db";
import { borrarImagen } from "../services/image-services";
import { executeQuery } from "../services/queryExecutor";
import { Notification } from "pg";

export async function initListener() {
  await listener.connect();

  listener.on("notification", async (msg: Notification) => {
    if (msg.channel === "imagen_borrada") {
      const link = msg.payload;
      if (!link) console.error("[ERROR] Payload vacío en imagen_borrada");
      await borrarImagen(link as string);
    }
	if (msg.channel === "orden_aceptada") {
	  const orden_id: int = msg.payload;
	  await crearFactura(orden_id as int);
	}
  });

  await listener.query("LISTEN imagen_borrada");
  console.log("Listener Activo, esperando eventos...");
}

async function crearFactura(orden_id: int) {
	const query_ObtenerUsernames = `SELECT comprador_username, vendedor_username FROM terox.ordenes WHERE orden_id = $1`;
	const query_ObtenerCUIL = `SELECT cuil FROM terox.identidad_fiscal WHERE username = $1`;
	const query_crearFactura = `INSERT INTO terox.facturas VALUES($1, $2, $3)`;
	usernames = await executeQuery(query_ObtenerUsernames, [orden_id], '');
	cuil_comprador = await executeQuery(query_ObtenerCUIL, [usernames.rows[0]?.comprador_username],'');
	cuil_vendedor = await executeQuery(query_ObtenerCUIL, [usernames.rows[0]?.vendedor_username],'');
	await executeQuery(query_crearFactura, [orden_id, cuil_comprador, cuil_vendedor], 'Error al crear factura');
	return;
}
