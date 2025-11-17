export function mostrarNotificacion(mensaje: string, tipo: 'success' | 'error') {
    alert(mensaje);
    console.log(`[${tipo}] ${mensaje}`);
}
