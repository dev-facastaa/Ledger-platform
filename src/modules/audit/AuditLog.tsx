import { useState } from 'react'
import { Search, Download, Eye } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Input'
import { mockAuditEvents } from '../../services/mock/audit'
import type { AuditEvent, AuditAction } from '../../types'
import { useAppStore } from '../../store'

const ACTION_OPTIONS = [
  { value: '', label: 'Todas las acciones' },
  { value: 'crear_ledger', label: 'Crear Ledger' },
  { value: 'editar_ledger', label: 'Editar Ledger' },
  { value: 'cambiar_estado', label: 'Cambiar Estado' },
  { value: 'crear_config', label: 'Crear Config' },
  { value: 'editar_config', label: 'Editar Config' },
  { value: 'eliminar_config', label: 'Eliminar Config' },
]

const ACTION_LABELS: Record<AuditAction, string> = {
  crear_ledger: 'Crear Ledger',
  editar_ledger: 'Editar Ledger',
  cambiar_estado: 'Cambiar Estado',
  crear_config: 'Crear Config',
  editar_config: 'Editar Config',
  eliminar_config: 'Eliminar Config',
}

const ACTION_COLORS: Record<AuditAction, string> = {
  crear_ledger: '#4caf50',
  editar_ledger: '#3e4983',
  cambiar_estado: '#ff9800',
  crear_config: '#4caf50',
  editar_config: '#3e4983',
  eliminar_config: '#ee424e',
}

function DiffView({ before, after }: { before?: Record<string, unknown>; after?: Record<string, unknown> }) {
  if (!before && !after) return null

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-xs font-semibold text-[#ee424e] mb-2">Antes</p>
        <pre className="p-3 rounded-lg bg-red-50 text-xs font-mono text-red-800 overflow-auto max-h-40">
          {before ? JSON.stringify(before, null, 2) : '—'}
        </pre>
      </div>
      <div>
        <p className="text-xs font-semibold text-[#4caf50] mb-2">Después</p>
        <pre className="p-3 rounded-lg bg-green-50 text-xs font-mono text-green-800 overflow-auto max-h-40">
          {after ? JSON.stringify(after, null, 2) : '—'}
        </pre>
      </div>
    </div>
  )
}

export function AuditLog() {
  const { ledgers, addToast } = useAppStore()
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState<AuditAction | ''>('')
  const [ledgerFilter, setLedgerFilter] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null)

  const ledgerOptions = [
    { value: '', label: 'Todos los ledgers' },
    ...ledgers.map(l => ({ value: l.id, label: l.name })),
  ]

  const filtered = mockAuditEvents.filter(e => {
    const matchSearch = !search || e.user.includes(search) || e.ledgerName.includes(search)
    const matchAction = !actionFilter || e.action === actionFilter
    const matchLedger = !ledgerFilter || e.ledgerId === ledgerFilter
    return matchSearch && matchAction && matchLedger
  })

  const handleExport = () => {
    addToast('success', `${filtered.length} eventos exportados (PDF simulado para prototipo)`)
  }

  return (
    <div className="fade-in">
      <PageHeader
        title="Auditoría de Cambios"
        breadcrumbs={[{ label: 'Auditoría' }]}
        actions={
          <Button variant="secondary" onClick={handleExport} size="sm">
            <Download size={16} /> Exportar PDF
          </Button>
        }
      />

      {/* Info Banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f1f2f6] border border-[#d2d4e1] mb-6">
        <span className="w-2 h-2 rounded-full bg-[#4caf50]" />
        <p className="text-sm text-[#6c759f]">
          Registro <span className="font-semibold text-[#121e6c]">inmutable</span> — todos los eventos son append-only. Retención: 7 años (SFC).
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#969bbd]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por usuario o ledger..."
                className="h-12 w-full pl-10 pr-4 rounded-lg border border-[#d2d4e1] text-sm focus:outline-none focus:border-2 focus:border-[#121e6c] bg-white text-[#121e6c] placeholder:text-[#969bbd]"
              />
            </div>
          </div>
          <div className="w-48">
            <Select options={ACTION_OPTIONS} value={actionFilter} onChange={e => setActionFilter(e.target.value as AuditAction | '')} />
          </div>
          <div className="w-56">
            <Select options={ledgerOptions} value={ledgerFilter} onChange={e => setLedgerFilter(e.target.value)} />
          </div>
          <p className="text-sm text-[#6c759f]">{filtered.length} evento(s)</p>
        </div>
      </Card>

      {/* Timeline */}
      <Card padding={false}>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#f1f2f6', borderBottom: '2px solid #d2d4e1' }}>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#121e6c]">Timestamp</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#121e6c]">Usuario</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#121e6c]">Acción</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#121e6c]">Ledger</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#121e6c]">IP</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(event => (
              <tr key={event.id} className="border-b border-[#d2d4e1] hover:bg-[#fdeaeb] transition-colors">
                <td className="px-4 py-3 text-xs text-[#6c759f]">
                  {new Date(event.timestamp).toLocaleString('es-CO', {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </td>
                <td className="px-4 py-3 text-sm text-[#121e6c] font-semibold">{event.user}</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center h-6 px-3 rounded-xl text-xs font-semibold text-white"
                    style={{ background: ACTION_COLORS[event.action] }}
                  >
                    {ACTION_LABELS[event.action]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#6c759f] max-w-[200px] truncate">{event.ledgerName}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#969bbd]">{event.ip}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="p-1.5 rounded-lg hover:bg-[#f1f2f6] text-[#6c759f] hover:text-[#121e6c] transition-colors"
                  >
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Event Detail Modal */}
      <Modal
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Detalle de Evento de Auditoría"
        maxWidth="max-w-2xl"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-[#6c759f] uppercase tracking-wide">Usuario</p>
                <p className="text-sm font-semibold text-[#121e6c]">{selectedEvent.user}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#6c759f] uppercase tracking-wide">Acción</p>
                <span className="inline-flex items-center h-6 px-3 rounded-xl text-xs font-semibold text-white"
                  style={{ background: ACTION_COLORS[selectedEvent.action] }}>
                  {ACTION_LABELS[selectedEvent.action]}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#6c759f] uppercase tracking-wide">Ledger</p>
                <p className="text-sm text-[#121e6c]">{selectedEvent.ledgerName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#6c759f] uppercase tracking-wide">Timestamp</p>
                <p className="text-sm text-[#121e6c]">
                  {new Date(selectedEvent.timestamp).toLocaleString('es-CO')}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#6c759f] uppercase tracking-wide">IP de origen</p>
                <p className="font-mono text-sm text-[#121e6c]">{selectedEvent.ip}</p>
              </div>
            </div>
            <DiffView before={selectedEvent.before} after={selectedEvent.after} />
          </div>
        )}
      </Modal>
    </div>
  )
}
