import { useState } from 'react'
import { Search, Download, Eye, CheckCircle, XCircle, Clock } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Input'
import { mockTransactions, mockTransactionDetail } from '../../services/mock/transactions'
import type { Transaction, TxnStatus } from '../../types'
import { useAppStore } from '../../store'

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'processed', label: 'Procesado' },
  { value: 'failed', label: 'Fallido' },
  { value: 'pending', label: 'Pendiente' },
]

export function TransactionLog() {
  const { ledgers, addToast } = useAppStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TxnStatus | ''>('')
  const [ledgerFilter, setLedgerFilter] = useState('')
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null)

  const ledgerOptions = [
    { value: '', label: 'Todos los ledgers' },
    ...ledgers.map(l => ({ value: l.id, label: l.name })),
  ]

  const filtered = mockTransactions.filter(t => {
    const matchSearch = !search || t.transactionId.includes(search) || t.clientId.includes(search)
    const matchStatus = !statusFilter || t.status === statusFilter
    const matchLedger = !ledgerFilter || t.ledgerId === ledgerFilter
    return matchSearch && matchStatus && matchLedger
  })

  const handleExport = () => {
    const headers = 'Transaction ID,Client ID,Ledger,Tipo,Estado,Monto,Latencia (ms),Fecha\n'
    const rows = filtered.map(t =>
      `${t.transactionId},${t.clientId},${t.ledgerName},${t.transactionType},${t.status},${t.amount},${t.latencyMs || ''},${t.intakeAt}`
    ).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'transacciones.csv'; a.click()
    addToast('success', `${filtered.length} transacciones exportadas a CSV`)
  }

  const detail = selectedTxn ? mockTransactionDetail[selectedTxn.id] : null

  const StatusIcon = ({ status }: { status: TxnStatus }) => {
    if (status === 'processed') return <CheckCircle size={14} color="#4caf50" />
    if (status === 'failed') return <XCircle size={14} color="#ee424e" />
    return <Clock size={14} color="#ff9800" />
  }

  return (
    <div className="fade-in">
      <PageHeader
        title="Log de Transacciones"
        breadcrumbs={[{ label: 'Transacciones' }]}
        actions={
          <Button variant="secondary" onClick={handleExport} size="sm">
            <Download size={16} /> Exportar CSV
          </Button>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#969bbd]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por transaction_id o client_id..."
                className="h-12 w-full pl-10 pr-4 rounded-lg border border-[#d2d4e1] text-sm focus:outline-none focus:border-2 focus:border-[#121e6c] bg-white text-[#121e6c] placeholder:text-[#969bbd]"
              />
            </div>
          </div>
          <div className="w-44">
            <Select options={STATUS_OPTIONS} value={statusFilter} onChange={e => setStatusFilter(e.target.value as TxnStatus | '')} />
          </div>
          <div className="w-56">
            <Select options={ledgerOptions} value={ledgerFilter} onChange={e => setLedgerFilter(e.target.value)} />
          </div>
          <p className="text-sm text-[#6c759f]">{filtered.length} resultado(s)</p>
        </div>
      </Card>

      {/* Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#f1f2f6', borderBottom: '2px solid #d2d4e1' }}>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#121e6c]">Transaction ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#121e6c]">Client ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#121e6c]">Ledger</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#121e6c]">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#121e6c]">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#121e6c]">Monto</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#121e6c]">Latencia</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#121e6c]">Fecha ingesta</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(txn => (
                <tr key={txn.id} className="border-b border-[#d2d4e1] hover:bg-[#fdeaeb] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-[#121e6c]">{txn.transactionId}</td>
                  <td className="px-4 py-3 text-xs text-[#6c759f]">{txn.clientId}</td>
                  <td className="px-4 py-3 text-xs text-[#6c759f] max-w-[160px] truncate">{txn.ledgerName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#121e6c]">{txn.transactionType}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <StatusIcon status={txn.status} />
                      <Badge status={txn.status} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-[#121e6c]">
                    ${txn.amount.toLocaleString('es-CO')}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-[#6c759f]">
                    {txn.latencyMs ? `${txn.latencyMs.toLocaleString('es-CO')} ms` : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6c759f]">
                    {new Date(txn.intakeAt).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedTxn(txn)}
                      className="p-1.5 rounded-lg hover:bg-[#f1f2f6] text-[#6c759f] hover:text-[#121e6c] transition-colors"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction Detail Modal */}
      <Modal
        open={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        title="Detalle de Transacción"
        maxWidth="max-w-2xl"
      >
        {selectedTxn && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-[#6c759f] uppercase tracking-wide">Transaction ID</p>
                <p className="font-mono text-sm text-[#121e6c]">{selectedTxn.transactionId}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#6c759f] uppercase tracking-wide">Estado</p>
                <Badge status={selectedTxn.status} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#6c759f] uppercase tracking-wide">Client ID</p>
                <p className="text-sm text-[#121e6c]">{selectedTxn.clientId}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#6c759f] uppercase tracking-wide">Latencia</p>
                <p className="text-sm font-semibold text-[#121e6c]">
                  {selectedTxn.latencyMs ? `${selectedTxn.latencyMs.toLocaleString('es-CO')} ms` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#6c759f] uppercase tracking-wide">Fecha ingesta</p>
                <p className="text-sm text-[#121e6c]">{new Date(selectedTxn.intakeAt).toLocaleString('es-CO')}</p>
              </div>
              {selectedTxn.processedAt && (
                <div>
                  <p className="text-xs font-semibold text-[#6c759f] uppercase tracking-wide">Procesado el</p>
                  <p className="text-sm text-[#121e6c]">{new Date(selectedTxn.processedAt).toLocaleString('es-CO')}</p>
                </div>
              )}
            </div>

            {selectedTxn.error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-xs font-semibold text-[#ee424e] mb-1">Error</p>
                <p className="text-sm text-red-700">{selectedTxn.error}</p>
              </div>
            )}

            {detail?.payload && (
              <div>
                <p className="text-xs font-semibold text-[#6c759f] uppercase tracking-wide mb-2">Payload</p>
                <pre className="p-4 rounded-lg bg-[#f1f2f6] text-xs font-mono text-[#121e6c] overflow-auto max-h-40">
                  {JSON.stringify(detail.payload, null, 2)}
                </pre>
              </div>
            )}

            {detail?.entries && detail.entries.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#6c759f] uppercase tracking-wide mb-2">Asientos Contables</p>
                <table className="w-full text-sm border border-[#d2d4e1] rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-[#f1f2f6] border-b border-[#d2d4e1]">
                      <th className="text-left px-4 py-2 text-xs font-semibold text-[#121e6c]">Cuenta</th>
                      <th className="text-right px-4 py-2 text-xs font-semibold text-[#121e6c]">Débito</th>
                      <th className="text-right px-4 py-2 text-xs font-semibold text-[#121e6c]">Crédito</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.entries.map((e, i) => (
                      <tr key={i} className="border-b border-[#f1f2f6]">
                        <td className="px-4 py-2 text-[#121e6c]">{e.accountCode} – {e.accountName}</td>
                        <td className="px-4 py-2 text-right text-[#121e6c]">
                          {e.debit > 0 ? `$${e.debit.toLocaleString('es-CO')}` : ''}
                        </td>
                        <td className="px-4 py-2 text-right text-[#121e6c]">
                          {e.credit > 0 ? `$${e.credit.toLocaleString('es-CO')}` : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
