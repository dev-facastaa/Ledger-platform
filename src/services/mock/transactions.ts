import type { Transaction, TransactionDetail, DashboardMetrics, Alert } from '../../types'

export const mockTransactions: Transaction[] = [
  { id: 't-001', transactionId: 'txn_abc123', clientId: 'cli_12345', ledgerId: 'ldg-001', ledgerName: 'ledger_cashout_montos_altos', transactionType: 'cashout_high_amount', status: 'processed', amount: 5000000, intakeAt: '2026-05-15T08:01:00Z', processedAt: '2026-05-15T08:01:03Z', latencyMs: 3200, workerId: 'worker-01' },
  { id: 't-002', transactionId: 'txn_def456', clientId: 'cli_67890', ledgerId: 'ldg-001', ledgerName: 'ledger_cashout_montos_altos', transactionType: 'cashout_high_amount', status: 'failed', amount: 2500000, intakeAt: '2026-05-15T08:05:00Z', processedAt: '2026-05-15T08:05:01Z', latencyMs: 1100, workerId: 'worker-02', error: "Campo 'amount_fee' llegó como null. El campo es obligatorio en la configuración del ledger." },
  { id: 't-003', transactionId: 'txn_ghi789', clientId: 'cli_11111', ledgerId: 'ldg-002', ledgerName: 'ledger_remesas_internacionales', transactionType: 'remesa_internacional', status: 'processed', amount: 3200000, intakeAt: '2026-05-15T08:10:00Z', processedAt: '2026-05-15T08:10:04Z', latencyMs: 4300, workerId: 'worker-01' },
  { id: 't-004', transactionId: 'txn_jkl012', clientId: 'cli_22222', ledgerId: 'ldg-003', ledgerName: 'ledger_pagos_pse', transactionType: 'pago_pse', status: 'processed', amount: 180000, intakeAt: '2026-05-15T08:15:00Z', processedAt: '2026-05-15T08:15:02Z', latencyMs: 2100, workerId: 'worker-03' },
  { id: 't-005', transactionId: 'txn_mno345', clientId: 'cli_33333', ledgerId: 'ldg-001', ledgerName: 'ledger_cashout_montos_altos', transactionType: 'cashout_high_amount', status: 'pending', amount: 7800000, intakeAt: '2026-05-15T08:20:00Z', latencyMs: undefined, workerId: undefined },
  { id: 't-006', transactionId: 'txn_pqr678', clientId: 'cli_44444', ledgerId: 'ldg-002', ledgerName: 'ledger_remesas_internacionales', transactionType: 'remesa_internacional', status: 'failed', amount: 1200000, intakeAt: '2026-05-15T08:25:00Z', processedAt: '2026-05-15T08:25:05Z', latencyMs: 5200, workerId: 'worker-02', error: "Timeout al conectar con proveedor de pagos internacionales." },
  { id: 't-007', transactionId: 'txn_stu901', clientId: 'cli_55555', ledgerId: 'ldg-003', ledgerName: 'ledger_pagos_pse', transactionType: 'pago_pse', status: 'processed', amount: 95000, intakeAt: '2026-05-15T08:30:00Z', processedAt: '2026-05-15T08:30:02Z', latencyMs: 1800, workerId: 'worker-01' },
  { id: 't-008', transactionId: 'txn_vwx234', clientId: 'cli_66666', ledgerId: 'ldg-001', ledgerName: 'ledger_cashout_montos_altos', transactionType: 'cashout_reversal', status: 'processed', amount: 5000000, intakeAt: '2026-05-15T08:35:00Z', processedAt: '2026-05-15T08:35:03Z', latencyMs: 3100, workerId: 'worker-03' },
  { id: 't-009', transactionId: 'txn_yza567', clientId: 'cli_77777', ledgerId: 'ldg-002', ledgerName: 'ledger_remesas_internacionales', transactionType: 'remesa_internacional', status: 'processed', amount: 4500000, intakeAt: '2026-05-15T08:40:00Z', processedAt: '2026-05-15T08:40:04Z', latencyMs: 3900, workerId: 'worker-02' },
  { id: 't-010', transactionId: 'txn_bcd890', clientId: 'cli_88888', ledgerId: 'ldg-003', ledgerName: 'ledger_pagos_pse', transactionType: 'pago_pse', status: 'failed', amount: 250000, intakeAt: '2026-05-15T08:45:00Z', processedAt: '2026-05-15T08:45:01Z', latencyMs: 900, workerId: 'worker-01', error: "Cuenta bancaria del cliente inválida o inactiva." },
]

export const mockTransactionDetail: Record<string, TransactionDetail> = {
  't-002': {
    ...mockTransactions[1],
    payload: {
      client_id: 'cli_67890',
      product_id: 'cashout_high',
      transaction_id: 'txn_def456',
      transaction_type: 'cashout_high_amount',
      amounts: { amount_principal: 2500000, amount_fee: null },
      transaction_date: '2026-05-15T08:05:00Z',
    },
    entries: [],
  },
  't-001': {
    ...mockTransactions[0],
    payload: {
      client_id: 'cli_12345',
      product_id: 'cashout_high',
      transaction_id: 'txn_abc123',
      transaction_type: 'cashout_high_amount',
      amounts: { amount_principal: 5000000, amount_fee: 125000 },
      transaction_date: '2026-05-15T08:01:00Z',
    },
    entries: [
      { accountCode: '1105', accountName: 'Caja', debit: 5000000, credit: 0 },
      { accountCode: '4135', accountName: 'Servicios de intermediación financiera', debit: 0, credit: 125000 },
    ],
  },
}

export const mockDashboardMetrics: DashboardMetrics = {
  totalTransactions: 1842,
  avgLatencyMs: 2800,
  p50LatencyMs: 2100,
  p95LatencyMs: 4800,
  p99LatencyMs: 8200,
  errorRate: 2.5,
  volumeByLedger: [
    { ledgerName: 'cashout_montos_altos', count: 782 },
    { ledgerName: 'remesas_internacionales', count: 541 },
    { ledgerName: 'pagos_pse', count: 398 },
    { ledgerName: 'dataphone_terminal', count: 121 },
    { ledgerName: 'otros', count: 0 },
  ],
  hourlyData: Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(2026, 4, 15, i).toISOString()
    const base = 60 + Math.floor(Math.random() * 50)
    return { hour, count: base, errors: Math.floor(base * 0.025) }
  }),
}

export const mockAlerts: Alert[] = [
  { id: 'alt-001', type: 'error_rate', ledgerName: 'ledger_cashout_montos_altos', message: 'Tasa de errores: 2.5% (umbral: 1%)', severity: 'critical', since: '2026-05-15T07:30:00Z' },
  { id: 'alt-002', type: 'latency', ledgerName: 'ledger_remesas_internacionales', message: 'Latencia P95: 38s (umbral: 30s)', severity: 'warning', since: '2026-05-15T08:00:00Z' },
]
