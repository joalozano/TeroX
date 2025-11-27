export interface QueryFilter {
    nombre: string;
    aplica(query_params: Record<string, string | undefined>): boolean;
    condicion(i: number, query_params: Record<string, string | undefined>): string;
    valor(query_params: Record<string, string | undefined>): any[];
}


export class FiltroSimple implements QueryFilter {
    constructor(public nombre: string) { }

    aplica(query_params: Record<string, string | undefined>): boolean {
        return query_params[this.nombre] !== undefined;
    }

    condicion(i: number): string {
        return `${this.nombre} = $${i + 1}`;
    }

    valor(query_params: Record<string, string | undefined>) {
        return [query_params[this.nombre]];
    }
}

export class FiltroLike implements QueryFilter {
    constructor(public nombre: string, public columnas: string[] = [nombre]) { }

    aplica(query_params: Record<string, string | undefined>): boolean {
        const v = query_params[this.nombre];
        return v !== undefined && v.trim() !== "";
    }

    condicion(i: number, _query_params: Record<string, string | undefined>): string {
        const idx = i + 1;
        const partes = this.columnas.map(col => `${col} ILIKE $${idx}`);
        return `(${partes.join(" OR ")})`;
    }

    valor(query_params: Record<string, string | undefined>): any[] {
        const v = query_params[this.nombre] ?? "";
        return [`%${v}%`];
    }
}

export class FiltroUsernameNotNull implements QueryFilter {
    nombre = "username_not_null";

    aplica(): boolean {
        return true;
    }

    condicion(_i: number): string {
        return `username IS NOT NULL`;
    }

    valor(): any[] {
        return [];
    }
}
