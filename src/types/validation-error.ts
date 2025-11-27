declare global {
    
    interface ValidationError {
        field: string;
        mensaje: string;
    }
}

export{}