export type TableName = 'imagenes' | 'productos' | 'usuarios' | 'identidad_fiscal' | 'compras'
//defino un tipo general para poder definir bien la interfaz de TableDef, veo si sirve luego
export type ColumnName = UsuarioColumnName | ProductoColumnName | Identidad_fiscal | ComprasColumnName


export type UsuarioColumnName = 'username' | 'password' |
                                'nombre' | 'email'

export type ProductoColumnName = 'producto_id' | 'nombre' | 'descripcion' | 
                                'precio' | 'stock' | 'usuario_id'

export type Identidad_fiscal = 'cuil' | 'nombre_completo' | 'domicilio_fiscal' | 'username'              

export type ComprasColumnName = 'compra_id' | 'username_comprador' | 'producto_id' |
                                'dni' | "numero_tarjeta" | 'fecha_vencimiento' | 
                                'CVV' | 'nombre' | 'apellido' | 'cuil' | 'direccion'

export type ColumnType = 'text' | 'int' | 'date'


export interface ColumnDef {
    name: ColumnName
    type: ColumnType
    nullable: boolean
    title?: string
    description?: string
    htmlType?: String
    autocomplete?: string
    hidden?: boolean
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
            { name: 'username' as UsuarioColumnName, type: 'text', title: 'Usuario', 
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
        pk: ['username' as UsuarioColumnName],
        orderBy: ['username' as UsuarioColumnName],
        elementName: 'usuario'
    },
    {
        name: 'productos',
        columns: [
            { name: 'producto_id' , type: 'int', nullable : false, hidden:true },
            { name: 'nombre' , type: 'text', nullable : false, title: 'Nombre' },
            { name : 'precio' , type: 'int', nullable : false, title: 'Precio'},
            { name : 'stock', type: 'int', nullable : false, title: 'Cantidad' },
            { name : 'descripcion', type: 'text', nullable : true, title: 'Descripción' },
            { name : 'usuario_id', type: 'int', nullable : false, hidden:true }
        ],
        pk: ['producto_id'],
    },  
    {
        name: 'identidad_fiscal',
        columns: [
            { name: 'cuil', type: 'int', nullable : false, title: 'CUIL' },
            { name: 'nombre_completo', type: 'text', nullable : false, 
                title: 'Nombre Completo' },
            { name: 'domicilio_fiscal', type: 'text', nullable : false, 
                title: 'Domicilio Fiscal'},
            { name: 'username', type: 'text', nullable : false, hidden:true }
        ],
        pk: ['cuil'],
    },
    {
        name: 'compras',
        columns : [
            {name: 'compra_id', type: 'int', nullable: false, hidden:true},
            {name: 'username_comprador', type: 'text', nullable: false, htmlType: 'hidden'},
            {name: 'producto_id', type: 'int', nullable: false, htmlType: 'hidden'},
            {name: 'numero_tarjeta', type: 'int', nullable: false, title: 'Número de Tarjeta'},
            {name: 'CVV', type: 'int', nullable: false ,title: 'CVV'},
            {name: 'fecha_vencimiento', type: 'date', nullable: false, title: 'Fecha de Vencimiento'},
            {name: 'nombre', type: 'text', nullable: false, title: 'Nombre'},
            {name: 'apellido', type: 'text', nullable: false, title: 'Apellido'},
            {name: 'cuil', type: 'text', nullable: false, title: 'CUIL'},
            {name: 'direccion', type: 'text', nullable: false, title: 'Dirección de Envío'}
        ],
        pk: ['compra_id']
    }
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
                    hidden: c.hidden ?? false,
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
export const productoTableDef = tableDefs.find( t => t.name === 'productos')!
export const identidadFiscalTableDef = tableDefs.find( t => t.name === 'identidad_fiscal')!