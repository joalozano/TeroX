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
  });

  await listener.query("LISTEN imagen_borrada");
  console.log("Listener Activo, esperando eventos...");
}
