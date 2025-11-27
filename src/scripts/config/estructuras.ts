export type TableName = 'imagenes' | 'productos' | 'usuarios' | 'identidad_fiscal' | 'compra_formulario' | 'ordenes'
//defino un tipo general para poder definir bien la interfaz de TableDef, veo si sirve luego
export type ColumnName = UsuarioColumnName | ProductoColumnName |
    Identidad_fiscal | ComprasColumnName | OrdenesColumnName


export type UsuarioColumnName = 'username' | 'password' |
    'nombre' | 'email'

export type ProductoColumnName = 'producto_id' | 'nombre' | 'descripcion' |
    'precio' | 'stock' | 'usuario_id' | 'rating' | 'cantidad_rating'

export type Identidad_fiscal = 'cuil' | 'nombre_completo' | 'domicilio_fiscal' | 'username'

export type ComprasColumnName = | 'producto_id' | "numero_tarjeta" | 'fecha_vencimiento' |
    'CVV' | 'direccion' | 'cantidad'

export type OrdenesColumnName = 'orden_id' | 'producto_id' | 'comprador_username'
    | 'vendedor_username' | 'direccion_entrega' | 'cantidad_pedida' | 'precio_unitario'
    | 'estado_de_entrega' | 'rating' | 'producto_nombre'

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
    pk?: [ColumnName]
    title?: string
    orderBy?: ColumnName[]
    elementName?: string
}

const tableDefinitions: TableDef[] = [
    {
        name: 'usuarios',
        columns: [
            {
                name: 'username' as UsuarioColumnName, type: 'text', title: 'Usuario',
                htmlType: 'text', nullable: false, autocomplete: 'username', description: 'Ingrese su usuario'
            },
            {
                name: 'email' as UsuarioColumnName, type: 'text', htmlType: 'email', title: 'Email',
                nullable: false, autocomplete: 'current-email', description: 'Ingrese su email'
            },
            {
                name: 'nombre' as UsuarioColumnName, type: 'text', title: 'Nombre real',
                description: 'Ingrese su nombre real', nullable: false
            },
            {
                name: 'password' as UsuarioColumnName, type: 'text', htmlType: 'password', title: 'Contraseña',
                description: 'Ingrese su contraseña', nullable: false, autocomplete: 'current-password', hidden: true
            }
        ],
        pk: ['username' as UsuarioColumnName],
        orderBy: ['username' as UsuarioColumnName],
        elementName: 'usuario'
    },
    {
        name: 'productos',
        columns: [
            { name: 'producto_id', type: 'int', nullable: false, hidden: true },
            { name: 'nombre', type: 'text', nullable: false, title: 'Nombre' },
            { name: 'precio', type: 'int', nullable: false, title: 'Precio' },
            { name: 'stock', type: 'int', nullable: false, title: 'Cantidad' },
            { name: 'descripcion', type: 'text', nullable: true, title: 'Descripción' },
            { name: 'usuario_id', type: 'int', nullable: false, hidden: true, htmlType: 'hidden' },
            { name: 'rating', type: 'int', nullable: true },
            { name: 'cantidad_rating', type: 'int', nullable: true, hidden: true }
        ],
        pk: ['producto_id'],
        elementName: 'producto'
    },
    {
        name: 'identidad_fiscal',
        columns: [
            { name: 'cuil', type: 'int', nullable: false, title: 'CUIL' },
            {
                name: 'nombre_completo', type: 'text', nullable: false,
                title: 'Nombre Completo'
            },
            {
                name: 'domicilio_fiscal', type: 'text', nullable: false,
                title: 'Domicilio Fiscal'
            },
            { name: 'username', type: 'text', nullable: false, title: 'Usuario' }
        ],
        pk: ['cuil'],
        elementName: 'identidad fiscal'
    },
    {
        name: 'compra_formulario',
        columns: [
            { name: 'producto_id', type: 'int', nullable: false, htmlType: 'hidden' },
            { name: 'numero_tarjeta', type: 'int', nullable: false, title: 'Número de Tarjeta' },
            { name: 'CVV', type: 'int', nullable: false, title: 'CVV' },
            { name: 'fecha_vencimiento', type: 'date', nullable: false, title: 'Fecha de Vencimiento' },
            { name: 'direccion', type: 'text', nullable: false, title: 'Dirección de Envío' },
            { name: 'cantidad', type: 'int', nullable: false, title: 'Cantidad' }
        ]
    },
    {
        name: 'ordenes',
        columns: [
            { name: 'orden_id', type: 'int', nullable: false, hidden: true },
            { name: 'producto_id', type: 'int', nullable: false, hidden: true },
            { name: 'comprador_username', type: 'text', nullable: false, hidden: true },
            { name: 'vendedor_username', type: 'text', nullable: false, hidden: true },
            { name: 'producto_nombre', type: 'text', nullable: false, title: 'Producto' },
            { name: 'precio_unitario', type: 'int', nullable: false, title: 'Precio Unitario' },
            { name: 'cantidad_pedida', type: 'int', nullable: false, title: 'Cantidad' },
            { name: 'direccion_entrega', type: 'text', nullable: false, title: 'Dirección de Entrega' },
            { name: 'estado_de_entrega', type: 'text', nullable: false, title: 'Estado de Entrega' },
            { name: 'rating', type: 'int', nullable: true, title: 'Calificación' }
        ],
        pk: ['orden_id']
    }

]

export function completeTableDefaults(tableDef: TableDef[]): TableDef[] {
    return tableDef.map(t => {
        return {
            ...t,
            title: t.title ?? t.name,
            elementName: t.elementName ?? t.name,
            orderBy: t.orderBy ?? t.pk ?? [] as ColumnName[],
            columns: t.columns.map(c => {
                return {
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
export const usuarioTableDef = tableDefs.find(t => t.name === 'usuarios')!
export const productoTableDef = tableDefs.find(t => t.name === 'productos')!
export const identidadFiscalTableDef = tableDefs.find(t => t.name === 'identidad_fiscal')!
export const ordenesTableDef = tableDefs.find(t => t.name === 'ordenes')!
