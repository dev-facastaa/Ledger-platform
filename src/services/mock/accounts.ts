import type { Account } from '../../types'

export const mockAccounts: Account[] = [
  { code: '1105', name: 'Caja', type: 'activo', status: 'activa' },
  { code: '1110', name: 'Bancos', type: 'activo', status: 'activa' },
  { code: '1115', name: 'Remesas en tránsito', type: 'activo', status: 'activa' },
  { code: '1120', name: 'Cuentas de ahorro', type: 'activo', status: 'activa' },
  { code: '1305', name: 'Clientes', type: 'activo', status: 'activa' },
  { code: '1310', name: 'Cuentas corrientes comerciales', type: 'activo', status: 'activa' },
  { code: '2105', name: 'Bancos nacionales', type: 'pasivo', status: 'activa' },
  { code: '2110', name: 'Corporaciones financieras', type: 'pasivo', status: 'activa' },
  { code: '2205', name: 'Proveedores nacionales', type: 'pasivo', status: 'activa' },
  { code: '2365', name: 'Retención en la fuente', type: 'pasivo', status: 'activa' },
  { code: '2367', name: 'Impuesto a las ventas retenido', type: 'pasivo', status: 'activa' },
  { code: '2408', name: 'Impuesto sobre las ventas por pagar', type: 'pasivo', status: 'activa' },
  { code: '3105', name: 'Capital suscrito y pagado', type: 'patrimonio', status: 'activa' },
  { code: '3605', name: 'Utilidad del ejercicio', type: 'patrimonio', status: 'activa' },
  { code: '4135', name: 'Servicios de intermediación financiera', type: 'ingreso', status: 'activa' },
  { code: '4210', name: 'Ingresos por comisiones', type: 'ingreso', status: 'activa' },
  { code: '4220', name: 'Ingresos por intereses', type: 'ingreso', status: 'activa' },
  { code: '5105', name: 'Gastos de personal', type: 'egreso', status: 'activa' },
  { code: '5195', name: 'Comisiones pagadas', type: 'egreso', status: 'activa' },
  { code: '5310', name: 'Provisiones', type: 'egreso', status: 'activa' },
]
