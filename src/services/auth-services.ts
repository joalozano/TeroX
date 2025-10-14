import { Client, Pool } from 'pg';
import { verifyPassword } from '../utils/crypto-utils'


export async function autenticarUsuario(
    pool: Pool | Client,
    username: string,
    password: string
): Promise<Usuario | null> {
    try {
        const result = await pool.query(
            'SELECT id, username, password_hash, nombre, email FROM terox.usuarios WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return null;
        }

        const user = result.rows[0];

        const passwordValida = await verifyPassword(password, user.password_hash);

        if (!passwordValida) {
            return null;
        }

        return {
            id: user.id,
            username: user.username,
            nombre: user.nombre,
            email: user.email
        };
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        return null;
    }
}
