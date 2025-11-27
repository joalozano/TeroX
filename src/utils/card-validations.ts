import { HttpError } from "../types/http-error";

export function validaciones(producto_id: any, errors: ValidationError[], numero_tarjeta: any, CVV: any, fecha_vencimiento: any) {
	if (!validarProductoId(producto_id)) {
		errors.push({
			field: 'producto_id',
			mensaje: 'El ID del producto debe ser un número entero positivo'
		});
	}

	const tarjetaErrors = validarNumeroTarjeta(numero_tarjeta);
	errors.push(...tarjetaErrors);

	const cvvErrors = validarCVV(CVV);
	errors.push(...cvvErrors);

	const fechaErrors = validarFechaVencimiento(fecha_vencimiento);
	errors.push(...fechaErrors);

	if (errors.length > 0) {
		const errorFormateado = errors.map(error => `- ${error.mensaje}`
		).join('\n');
		throw new HttpError(400, errorFormateado, errors);
	}
}

function validarProductoId(producto_id: any): boolean {
    if (typeof producto_id !== 'number' && isNaN(Number(producto_id))) {
        return false;
    }
    
    const id = Number(producto_id);
    return Number.isInteger(id) && id > 0;
}

function validarNumeroTarjeta(numero_tarjeta: string): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!numero_tarjeta || typeof numero_tarjeta !== 'string') {
        errors.push({
            field: 'numero_tarjeta',
            mensaje: 'El número de tarjeta es requerido'
        });
        return errors;
    }

    // Limpiar espacios y guiones
    const numeroLimpio = numero_tarjeta.replace(/[\s-]/g, '');

    // Verificar que solo hay números
    if (!/^\d+$/.test(numeroLimpio)) {
        errors.push({
            field: 'numero_tarjeta',
            mensaje: 'El número de tarjeta solo puede contener dígitos'
        });
    }
    console.log("LONGITUD NUMERO TARJETA: ", numeroLimpio.length);
    // Validación de longitud máxima
    if (numeroLimpio.length > 19 || numeroLimpio.length < 13) {
        errors.push({
            field: 'numero_tarjeta',
            mensaje: 'El número de tarjeta debe tener entre 13 y 19 dígitos'
        });
    }

    // algoritmo de Luhn
    if (!validarAlgoritmoLuhn(numeroLimpio)) {
        errors.push({
            field: 'numero_tarjeta',
            mensaje: 'El número de tarjeta no es válido (Luhn)'
        });
    }

    return errors;
}

/**
 * Algoritmo de Luhn para validar números de tarjeta
 */
function validarAlgoritmoLuhn(numero: string): boolean {
    let sum = 0;
    let isEven = false;
    // Recorrer de derecha a izquierda
    for (let i = numero.length - 1; i >= 0; i--) {
        let digit = parseInt(numero[i]!, 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

/**
 * 3. Validación de CVV
 */
function validarCVV(cvv: string): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!cvv || typeof cvv !== 'string') {
        errors.push({
            field: 'CVV',
            mensaje: 'El CVV es requerido'
        });
        return errors;
    }

    // Solo números
    if (!/^\d+$/.test(cvv)) {
        errors.push({
            field: 'CVV',
            mensaje: 'El CVV solo puede contener dígitos'
        });
    }

   // Longitud entre 3 y 4 dígitos
    if (cvv.length < 3 || cvv.length > 4) {
        errors.push({
            field: 'CVV',
            mensaje: 'El CVV debe tener entre 3 y 4 dígitos'
        });
    }

    return errors;
}

/**
 * 4. Validación de fecha de vencimiento (YYYY-MM)
 */
function validarFechaVencimiento(fecha_vencimiento: string): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!fecha_vencimiento || typeof fecha_vencimiento !== 'string') {
        errors.push({
            field: 'fecha_vencimiento',
            mensaje: 'La fecha de vencimiento es requerida'
        });
        return errors;
    }

    // Validar formato YYYY-MM
    const formatoValido = /^\d{4}-(0[1-9]|1[0-2])$/.test(fecha_vencimiento);
    if (!formatoValido) {
        errors.push({
            field: 'fecha_vencimiento',
            mensaje: 'La fecha debe tener el formato YYYY-MM (ej: 2025-12)'
        });
        return errors; // Si el formato es inválido, no continuar
    }

    const [añoStr, mesStr] = fecha_vencimiento.split('-');
    const año = parseInt(añoStr!, 10);
    const mes = parseInt(mesStr!, 10);

    const ahora = new Date();
    const añoActual = ahora.getFullYear();
    const mesActual = ahora.getMonth() + 1; 

    // Validar que no sea una fecha pasada
    if (año < añoActual || (año === añoActual && mes < mesActual)) {
        errors.push({
            field: 'fecha_vencimiento',
            mensaje: 'La tarjeta está expirada'
        });
    }

    // Validar que no sea más de 10 años en el futuro
    const añoMaximo = añoActual + 10;
    if (año > añoMaximo) {
        errors.push({
            field: 'fecha_vencimiento',
            mensaje: 'La fecha de vencimiento no puede ser mayor a 10 años en el futuro'
        });
    }

    return errors;
}