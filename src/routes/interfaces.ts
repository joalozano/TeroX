import { Response } from "express-serve-static-core";

//Es un error, no debería tener succes pero no podría enviar un objeto al front...
//el front debe saber si es un error o un exito de alguna forma
export function enviar_error_con_status(res: Response<any, Record<string, any>, number>, status: number, mensaje_de_error: string) {
    return res.status(status).json({
        success: false,
        error: mensaje_de_error
    });
}

export function enviar_exito_con_status(res: Response<any, Record<string, any>, number>, status: number, mensaje: string) {
    return res.status(status).json({ success: true, message: mensaje });
}

