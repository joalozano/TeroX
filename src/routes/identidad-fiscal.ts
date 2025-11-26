import { Router } from "express";
import { requireAuth, requireAuthAPI } from "../middlewares/middlewares-auth";
import { executeQuery } from "../services/queryExecutor";
import { identidadFiscalTableDef } from "../scripts/config/estructuras";

const router = Router();
router.post("/identidad_fiscal", requireAuth, async (req, res) => {
    const { cuil, nombre_completo, domicilio_fiscal } = req.body;
    const username = req.session.usuario?.username; 
        
    const query = `
        INSERT INTO terox.identidad_fiscal (cuil, username, nombre_completo, domicilio_fiscal)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) 
        DO UPDATE SET 
            cuil = EXCLUDED.cuil,
            nombre_completo = EXCLUDED.nombre_completo,
            domicilio_fiscal = EXCLUDED.domicilio_fiscal
        RETURNING *, (xmax = 0) AS was_inserted;
    `;
    
    const result = await executeQuery(query, [cuil, username, nombre_completo, domicilio_fiscal]);
    const fueInsert = result.rows[0].was_inserted;
    
    return res.status(201).json({
        success: true,
        mensaje: fueInsert ? 'Identidad fiscal creada' : 'Identidad fiscal actualizada',
        data: result.rows[0][identidadFiscalTableDef.pk[0]]
    });
});

router.get("/identidad_fiscal",requireAuthAPI, async (req, res) => {
    //quiero que el get solo pueda devolverme la data del usuario que inicio sesion
    const username = req.session.usuario?.username;
    
    const query = `
        SELECT cuil, nombre_completo, domicilio_fiscal 
        FROM terox.identidad_fiscal 
        WHERE username = $1`;

    const result = await executeQuery(query, [username]);
    
    if (result.rows.length === 0) {
        return res.status(404).json({ 
            success: false, 
            error: 'No se encontró identidad fiscal para el usuario' 
        });
    }
    return res.json({
        success: true,
        data: result.rows[0]
    });
    })
export default router;