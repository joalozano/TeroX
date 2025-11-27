import { executeQuery } from "./services/queryExecutor";

const INTERVALO_MS = 60_000;

async function avanzarEstados() {
    try {

        // Avanzar de "producto_en_centro_distribucion" a "entregado_al_comprador"
        await executeQuery(
            `UPDATE terox.ordenes
             SET estado_de_entrega = 'entregado_al_comprador'
             WHERE estado_de_entrega = 'producto_en_centro_distribucion';`,
            []
        );

        // Avanzar de "esperando_producto_vendedor" a "producto_en_centro_distribucion"
        await executeQuery(
            `UPDATE terox.ordenes
             SET estado_de_entrega = 'producto_en_centro_distribucion'
             WHERE estado_de_entrega = 'esperando_producto_vendedor';`,
            []
        );

        console.log("[Mock Ordenes] Estados avanzados correctamente");
    } catch (e) {
        console.error("[Mock Ordenes] Error:", e);
    }
}


avanzarEstados();

setInterval(avanzarEstados, INTERVALO_MS);

console.log("[Mock Ordenes] Mock de avance de estados inicializado");
