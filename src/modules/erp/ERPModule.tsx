import { useState } from 'react'
import { Upload } from 'lucide-react'
import { useAppStore } from '../../store'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/EmptyState'
import { ERPConfigTab } from './ERPConfigTab'
import { FREQUENCIES } from '../../services/mock/ledgers'
import type { Ledger } from '../../types'

function ERPStatusBadge({ configured }: { configured: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        configured
          ? 'bg-[#e8f5e9] text-[#2e7d32]'
          : 'bg-[#f1f2f6] text-[#6c759f]'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${configured ? 'bg-[#4caf50]' : 'bg-[#969bbd]'}`} />
      {configured ? 'Configurado' : 'No configurado'}
    </span>
  )
}

export function ERPModule() {
  const { ledgers, selectedCountry } = useAppStore()
  const [selectedLedger, setSelectedLedger] = useState<Ledger | null>(null)

  const frequencyLabel = (f: string) => FREQUENCIES.find(x => x.value === f)?.label ?? f

  // Filtrar por país activo (consistente con el header global)
  const countryLedgers = ledgers.filter(l => l.country === selectedCountry)
  const configured = countryLedgers.filter(l => l.erpConfig?.configured).length
  const pending = countryLedgers.length - configured

  return (
    <div className="fade-in">
      <PageHeader
        title="Integraciones"
        breadcrumbs={[{ label: 'Integraciones' }]}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-xs font-semibold text-[#6c759f] uppercase tracking-wide mb-1">Total ledgers</p>
          <p className="text-3xl font-black text-[#121e6c]">{countryLedgers.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-[#6c759f] uppercase tracking-wide mb-1">Configurados</p>
          <p className="text-3xl font-black text-[#4caf50]">{configured}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-[#6c759f] uppercase tracking-wide mb-1">Pendientes</p>
          <p className="text-3xl font-black text-[#ee424e]">{pending}</p>
        </Card>
      </div>

      {/* Table */}
      <Card padding={false}>
        {countryLedgers.length === 0 ? (
          <EmptyState
            icon={<Upload size={28} />}
            title="No hay ledgers"
            description="Crea un ledger para configurar su exportación ERP."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#F1F2F6', borderBottom: '2px solid #F1F2F6' }}>
                  <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: '#121E6C' }}>Ledger</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: '#121E6C' }}>Frecuencia Ledger</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: '#121E6C' }}>Formato ERP</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: '#121E6C' }}>Estado ERP</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: '#121E6C' }}>Estado Ledger</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: '#121E6C' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {countryLedgers.map(ledger => (
                  <tr
                    key={ledger.id}
                    className="border-b border-[#F1F2F6] hover:bg-[#F1F9FF] transition-colors"
                  >
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold" style={{ color: '#121E6C' }}>{ledger.name}</p>
                      {ledger.description && (
                        <p className="text-xs truncate max-w-[220px]" style={{ color: '#606060' }}>{ledger.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#f1f2f6] text-[#3e4983]">
                        {frequencyLabel(ledger.frequency)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {ledger.erpConfig ? (
                        <span className="text-xs font-mono font-semibold px-2 py-1 rounded bg-[#f1f2f6] text-[#121e6c]">
                          {ledger.erpConfig.format}
                        </span>
                      ) : (
                        <span className="text-xs text-[#969bbd]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <ERPStatusBadge configured={ledger.erpConfig?.configured ?? false} />
                    </td>
                    <td className="px-4 py-4">
                      <Badge status={ledger.status} />
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        variant="secondary"
                        onClick={() => setSelectedLedger(ledger)}
                      >
                        <Upload size={14} />
                        Configurar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ERP Config Modal */}
      {selectedLedger && (
        <Modal
          open={!!selectedLedger}
          onClose={() => setSelectedLedger(null)}
          title={`Configuración ERP — ${selectedLedger.name}`}
          maxWidth="max-w-3xl"
          footer={
            <Button variant="secondary" onClick={() => setSelectedLedger(null)}>Cerrar</Button>
          }
        >
          <ERPConfigTab ledger={selectedLedger} />
        </Modal>
      )}
    </div>
  )
}
