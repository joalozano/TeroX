import { ColumnDef } from "../config/estructuras.js"

export function convertir_a_nullable(columnas: ColumnDef[]){
    return columnas.map(column => {
        return {
            ...column,
            nullable : true
        }
    })
}
