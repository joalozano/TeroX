export type TableName = 'imagenes' | 'productos' | 'usuarios' | 'etc...'

//defino un tipo general para poder definir bien la interfaz de TableDef, veo si sirve luego
export type ColumnName = UsuarioColumnName
export type ColumnDef = ColumnDefUsuario

export type UsuarioColumnName = 'usuario_id' | 'username' | 
                                'nombre' | 'email' |'etc...'
export type ColumnType = 'text' | 'int' | 'date' | 'etc...'

export interface ColumnDefUsuario {
    name: UsuarioColumnName
    type: ColumnType
    nullable: boolean
    title?: string
    description?: string
    htmlType?: String
    autocomplete?: string
}

export interface TableDef {
    name: TableName
    columns: ColumnDef[]
    pk: [ColumnName]
    title?: string
    orderBy?: ColumnName[]
    elementName?: string
}


const tableDefinitions: TableDef[] = [
    {
        name: 'usuarios',
        columns: [
            { name: 'username'          as UsuarioColumnName, type: 'text', title: 'Usuario', 
                htmlType: 'text', nullable : false, autocomplete: 'username', description: 'Ingrese su usuario'},
            { name: 'email' as UsuarioColumnName, type: 'text', htmlType: 'email', title: 'Email',
                nullable: false, autocomplete: 'current-email', description: 'Ingrese su email' },
            { name: 'nombre'  as UsuarioColumnName, type: 'text', title: 'Nombre real',
                description: 'Ingrese su nombre real', nullable: false               
            },
            { name: 'password' as UsuarioColumnName, type: 'text', htmlType: 'password', title: 'Contraseña',
                description: 'Ingrese su contraseña', nullable: false, autocomplete: 'current-password'
            }
        ],
        pk: ['usuario_id' as UsuarioColumnName],
        orderBy: ['username' as UsuarioColumnName],
        elementName: 'usuario'
    },
]

export function completeTableDefaults(tableDef:TableDef[]): TableDef[]{
    return tableDef.map( t => {
        return {
            ...t,
            title: t.title ?? t.name,
            elementName: t.elementName ?? 'registro de ' + t.name,
            orderBy: t.orderBy ?? t.pk,
            columns: t.columns.map(c => {
                return {
                    // title: c.title ?? c.name,
                    ...c,
                    title: c.title ?? c.name,
                    description: c.description ?? ''
                }
            })
        }
    })
}

//es un array con las definiciones completas, tal como está en la interfaz TableDef
export const tableDefs = completeTableDefaults(tableDefinitions)
export const usuarioTableDef = tableDefs.find( t => t.name === 'usuarios')!