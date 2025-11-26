import { Router } from "express";
import { requireAuth, requireAuthAPI } from "../middlewares/middlewares-auth";
import { executeQuery } from "../services/queryExecutor";
import { identidadFiscalTableDef } from "../scripts/config/estructuras";

const router = Router();
router.post("/identidad_fiscal", requireAuth, async (req, res) => {
    const { cuil, nombre_completo, domicilio_fiscal } = req.body;
    const username = req.session.usuario?.username; 
    const nombresColumnas = identidadFiscalTableDef.columns.map(col => col.name).join(", ");
    const placeholders = identidadFiscalTableDef.columns.map((_, index) => `$${index + 1}`).join(", ");
    const columna_de_conflicto = 'username';
    
    const columnas_actualizables = identidadFiscalTableDef.columns
    .filter(col => col.name !== columna_de_conflicto) // Excluir PK
    .map(col => `${col.name} = EXCLUDED.${col.name}`)
    .join(',');

    const query = `
        INSERT INTO terox.${identidadFiscalTableDef.name} (${nombresColumnas})
        VALUES (${placeholders})
        ON CONFLICT (${columna_de_conflicto}) 
        DO UPDATE SET 
            ${columnas_actualizables}
        RETURNING *, (xmax = 0) AS was_inserted;
    `;
    
    const result = await executeQuery(query, [cuil, nombre_completo, domicilio_fiscal, username]);
    const fueInsert = result.rows[0].was_inserted;
    
    return res.status(201).json({
        success: true,
        mensaje: fueInsert ? 'Identidad fiscal creada' : 'Identidad fiscal actualizada',
        data: result.rows[0][identidadFiscalTableDef.pk[0]]
    });
});

//solo devuelve la identidad fiscal del usuario que inicio sesion
router.get("/identidad_fiscal",requireAuthAPI, async (req, res) => {
    //quiero que el get solo pueda devolverme la data del usuario que inicio sesion
    const username = req.session.usuario?.username;
    
    const query = `
        SELECT cuil, nombre_completo, domicilio_fiscal, username 
        FROM terox.identidad_fiscal 
        WHERE username = $1`;

    const result = await executeQuery(query, [username]);
    
    if (result.rows.length === 0) {
        return res.status(404).json({ 
            success: false, 
            error: 'No se encontró identidad fiscal para el usuario' 
        });
    }
    return res.status(201).json({
        success: true,
        data: result.rows[0]
    });
    })
export default router;