export type LedgerStatus = 'borrador' | 'activo' | 'inactivo'
export type AccountNature = 'debito' | 'credito'
export type AccountType = 'activo' | 'pasivo' | 'ingreso' | 'egreso' | 'patrimonio'
export type TxnStatus = 'processed' | 'failed' | 'pending'
export type AuditAction = 'crear_ledger' | 'editar_ledger' | 'cambiar_estado' | 'crear_config' | 'editar_config' | 'eliminar_config'
export type ExportFormat = 'CSV' | 'JSON' | 'XML'
export type ExportFrequency = 'diaria' | 'semanal' | 'mensual'

export interface Ledger {
  id: string
  name: string
  product: string
  description?: string
  status: LedgerStatus
  createdAt: string
  updatedAt: string
  createdBy: string
  configs: AccountingEntryConfig[]
  erpConfig?: ERPConfig
}

export interface AccountingEntryConfig {
  id: string
  ledgerId: string
  transactionType: string
  description?: string
  fieldMappings: FieldMapping[]
  createdAt: string
  version: number
}

export interface FieldMapping {
  id: string
  fieldName: string
  accountCode: string
  accountName: string
  nature: AccountNature
}

export interface Account {
  code: string
  name: string
  type: AccountType
  status: 'activa' | 'inactiva'
}

export interface Transaction {
  id: string
  transactionId: string
  clientId: string
  ledgerId: string
  ledgerName: string
  transactionType: string
  status: TxnStatus
  amount: number
  intakeAt: string
  processedAt?: string
  latencyMs?: number
  workerId?: string
  error?: string
}

export interface TransactionDetail extends Transaction {
  payload: Record<string, unknown>
  entries: JournalEntry[]
}

export interface JournalEntry {
  accountCode: string
  accountName: string
  debit: number
  credit: number
}

export interface DashboardMetrics {
  totalTransactions: number
  avgLatencyMs: number
  p50LatencyMs: number
  p95LatencyMs: number
  p99LatencyMs: number
  errorRate: number
  volumeByLedger: { ledgerName: string; count: number }[]
  hourlyData: { hour: string; count: number; errors: number }[]
}

export interface Alert {
  id: string
  type: 'latency' | 'error_rate' | 'inactivity'
  ledgerName: string
  message: string
  severity: 'warning' | 'critical'
  since: string
}

export interface AuditEvent {
  id: string
  timestamp: string
  user: string
  action: AuditAction
  ledgerId: string
  ledgerName: string
  ip: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
}

export interface ERPConfig {
  format: ExportFormat
  frequency: ExportFrequency
  fieldMappings: { source: string; target: string }[]
  configured: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
