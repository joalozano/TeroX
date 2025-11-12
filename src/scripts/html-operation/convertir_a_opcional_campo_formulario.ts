import { ColumnDef } from "../estructuras"

export function convertir_a_nullable(columnas: ColumnDef[]){
    return columnas.map(column => {
        return {
            ...column,
            nullable : true
        }
    })
}