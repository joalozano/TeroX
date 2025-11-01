import { verifyPassword } from '../utils/crypto-utils';
import { executeQuery } from './queryExecutor';
import { HttpError } from '../utils/http-error';

export async function autenticarUsuario(
    username: string,
    password: string
): Promise<Usuario> {
        const query = 'SELECT usuario_id, username, password_hash, nombre, email FROM terox.usuarios WHERE username = $1'
        const result = await executeQuery(
            query,
            [username]
        );

        if (result.rows.length === 0) {
            const errorMessage = 'Error al autenticar el usuario';
            throw new HttpError(500, errorMessage);
        }

        const user = result.rows[0];

        const passwordValida = await verifyPassword(password, user.password_hash);

        if (!passwordValida) {
            const errorMessage = 'Error al autenticar el usuario';
            throw new HttpError(500, errorMessage);
        }

        return {
            usuario_id: user.usuario_id,
            username: user.username,
            nombre: user.nombre,
            email: user.email
        };
}
