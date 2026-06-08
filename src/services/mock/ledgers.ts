import type { Ledger, LedgerCompany, LedgerCurrency } from '../../types'

export const mockLedgers: Ledger[] = [
  {
    id: 'ldg-001',
    name: 'ledger_cashout_montos_altos',
    product: 'Cashout Montos Altos',
    description: 'Retiros en efectivo superiores a $2M COP para Tribu Banking',
    status: 'activo',
    country: 'colombia',
    frequency: 'diario',
    company: 'CF',
    currency: 'COP',
    internalId: 'LDG-001',
    createdAt: '2026-04-10T09:00:00Z',
    updatedAt: '2026-04-15T14:30:00Z',
    createdBy: 'maria.lopez@bold.co',
    configs: [
      {
        id: 'cfg-001',
        ledgerId: 'ldg-001',
        transactionType: 'cashout_high_amount',
        description: 'Registro de retiros de alto valor',
        version: 2,
        createdAt: '2026-04-12T10:00:00Z',
        fieldMappings: [
          { id: 'fm-001', fieldName: 'amount_principal', accountCode: '1105', accountName: 'Caja', nature: 'debito' },
          { id: 'fm-002', fieldName: 'amount_fee', accountCode: '4135', accountName: 'Servicios de intermediación financiera', nature: 'credito' },
        ],
      },
      {
        id: 'cfg-002',
        ledgerId: 'ldg-001',
        transactionType: 'cashout_reversal',
        description: 'Reversión de retiros fallidos',
        version: 1,
        createdAt: '2026-04-14T11:00:00Z',
        fieldMappings: [
          { id: 'fm-003', fieldName: 'amount_principal', accountCode: '1105', accountName: 'Caja', nature: 'credito' },
          { id: 'fm-004', fieldName: 'amount_fee', accountCode: '4135', accountName: 'Servicios de intermediación financiera', nature: 'debito' },
        ],
      },
    ],
    erpConfig: {
      format: 'CSV',
      frequency: 'diaria',
      fieldMappings: [
        { source: 'transaction_id', target: 'TRANS_ID' },
        { source: 'amount_principal', target: 'MONTO' },
      ],
      configured: true,
    },
  },
  {
    id: 'ldg-002',
    name: 'ledger_remesas_internacionales',
    product: 'Remesas Internacionales',
    description: 'Envíos internacionales de dinero con retención de impuestos',
    status: 'activo',
    country: 'peru',
    frequency: 'mensual',
    company: 'CF',
    currency: 'USD',
    internalId: 'LDG-002',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-05-10T16:00:00Z',
    createdBy: 'carlos.mendez@bold.co',
    configs: [
      {
        id: 'cfg-003',
        ledgerId: 'ldg-002',
        transactionType: 'remesa_internacional',
        description: 'Envío de remesa con impuestos',
        version: 3,
        createdAt: '2026-03-05T09:00:00Z',
        fieldMappings: [
          { id: 'fm-005', fieldName: 'amount_principal', accountCode: '1115', accountName: 'Remesas en tránsito', nature: 'debito' },
          { id: 'fm-006', fieldName: 'amount_fee', accountCode: '4210', accountName: 'Ingresos por comisiones', nature: 'credito' },
          { id: 'fm-007', fieldName: 'amount_tax', accountCode: '2365', accountName: 'Retención en la fuente', nature: 'credito' },
        ],
      },
    ],
    erpConfig: { format: 'JSON', frequency: 'mensual', fieldMappings: [], configured: false },
  },
  {
    id: 'ldg-003',
    name: 'ledger_pagos_pse',
    product: 'Pagos PSE',
    description: 'Pagos electrónicos mediante PSE',
    status: 'activo',
    country: 'colombia',
    frequency: 'semanal',
    company: 'SAS',
    currency: 'COP',
    internalId: 'LDG-003',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-03-20T11:00:00Z',
    createdBy: 'maria.lopez@bold.co',
    configs: [
      {
        id: 'cfg-004',
        ledgerId: 'ldg-003',
        transactionType: 'pago_pse',
        description: 'Débito automático PSE',
        version: 1,
        createdAt: '2026-02-18T09:00:00Z',
        fieldMappings: [
          { id: 'fm-008', fieldName: 'amount_principal', accountCode: '1110', accountName: 'Bancos', nature: 'debito' },
          { id: 'fm-009', fieldName: 'amount_fee', accountCode: '4135', accountName: 'Servicios de intermediación financiera', nature: 'credito' },
        ],
      },
    ],
    erpConfig: { format: 'CSV', frequency: 'diaria', fieldMappings: [], configured: false },
  },
  {
    id: 'ldg-004',
    name: 'ledger_dataphone_terminal',
    product: 'Datáfonos Terminal',
    description: 'Transacciones de datáfonos físicos Bold',
    status: 'inactivo',
    country: 'colombia',
    frequency: 'quincenal',
    company: 'CF',
    currency: 'COP',
    internalId: 'LDG-004',
    createdAt: '2025-11-01T08:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
    createdBy: 'pedro.garcia@bold.co',
    configs: [
      {
        id: 'cfg-005',
        ledgerId: 'ldg-004',
        transactionType: 'venta_dataphone',
        description: 'Venta en terminal física',
        version: 1,
        createdAt: '2025-11-05T10:00:00Z',
        fieldMappings: [
          { id: 'fm-010', fieldName: 'amount_principal', accountCode: '1110', accountName: 'Bancos', nature: 'debito' },
          { id: 'fm-011', fieldName: 'amount_commission', accountCode: '4210', accountName: 'Ingresos por comisiones', nature: 'credito' },
        ],
      },
    ],
    erpConfig: { format: 'CSV', frequency: 'diaria', fieldMappings: [], configured: false },
  },
  {
    id: 'ldg-005',
    name: 'ledger_cashout_express',
    product: 'Cashout Express',
    description: 'Retiros express procesados en menos de 1 hora',
    status: 'borrador',
    country: 'peru',
    frequency: 'diario',
    company: 'Capital',
    currency: 'COP',
    internalId: 'LDG-005',
    createdAt: '2026-05-13T14:00:00Z',
    updatedAt: '2026-05-13T14:00:00Z',
    createdBy: 'maria.lopez@bold.co',
    configs: [],
    erpConfig: { format: 'CSV', frequency: 'diaria', fieldMappings: [], configured: false },
  },
]

export const PRODUCTS = [
  'Cashout Montos Altos',
  'Cashout Express',
  'Remesas Internacionales',
  'Pagos PSE',
  'Datáfonos Terminal',
  'Link de Pago',
  'Cobro Recurrente',
]

export const COUNTRIES = [
  { value: 'colombia', label: '🇨🇴 Colombia' },
  { value: 'peru',     label: '🇵🇪 Perú' },
]

export const FREQUENCIES = [
  { value: 'diario',    label: 'Diario' },
  { value: 'semanal',   label: 'Semanal' },
  { value: 'quincenal', label: 'Quincenal' },
  { value: 'mensual',   label: 'Mensual' },
]

export const COMPANIES: { value: LedgerCompany; label: string }[] = [
  { value: 'CF',      label: 'Bold CF' },
  { value: 'SAS',     label: 'Bold Co' },
  { value: 'Capital', label: 'Bold Capital' },
  { value: 'Peru',    label: 'Bold Pe' },
]

// Opciones filtradas por país
export const COMPANIES_BY_COUNTRY: Record<string, { value: LedgerCompany; label: string }[]> = {
  colombia: [
    { value: 'CF',      label: 'Bold CF' },
    { value: 'SAS',     label: 'Bold Co' },
    { value: 'Capital', label: 'Bold Capital' },
  ],
  peru: [
    { value: 'Peru', label: 'Bold Pe' },
  ],
}

export const CURRENCIES: { value: LedgerCurrency; label: string }[] = [
  { value: 'COP', label: 'COP — Peso Colombiano' },
  { value: 'USD', label: 'USD — Dólar Estadounidense' },
  { value: 'PEN', label: 'PEN — Sol Peruano' },
]
