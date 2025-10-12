import { Router } from "express";
import pool from "../config/db";
import {autenticarUsuario, Usuario} from '../models/auth'
const router = Router();

router.post('/login', async (req, res) => {
    
    const usuario: Usuario | null = await autenticarUsuario(pool, req.body.username, req.body.password)
    console.log("USUARIO: ", usuario)
    if (!(usuario === null)){
        req.session.usuario= usuario;
        return res.status(200).json({message: 'Login exitoso'})
    }

	return res.status(400).json({error: 'Error: nombre de usuario o contraseña incorrecto'});
});

router.post('/register',async (req, res) => {
    
    
});

export default router;