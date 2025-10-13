declare global {
    interface Usuario {
        id: number;
        username: string;
        nombre: string | null;
        email: string | null;
    }
}

export {};