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
