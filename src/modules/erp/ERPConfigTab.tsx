import { useState } from 'react'
import { Info, Plus, Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Select } from '../../components/ui/Input'
import { useAppStore } from '../../store'
import type { Ledger, ExportFormat, ExportFrequency } from '../../types'

interface Props { ledger: Ledger }

const FORMAT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: 'CSV', label: 'CSV' },
  { value: 'JSON', label: 'JSON' },
  { value: 'XML', label: 'XML' },
]
const FREQUENCY_OPTIONS: { value: ExportFrequency; label: string }[] = [
  { value: 'diaria', label: 'Diaria' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensual', label: 'Mensual' },
]

const PREVIEW_DATA = [
  { TRANS_ID: 'txn_abc123', MONTO: '5000000', TIPO: 'cashout_high_amount', FECHA: '2026-05-15' },
  { TRANS_ID: 'txn_def456', MONTO: '2500000', TIPO: 'cashout_high_amount', FECHA: '2026-05-15' },
  { TRANS_ID: 'txn_ghi789', MONTO: '3200000', TIPO: 'cashout_reversal', FECHA: '2026-05-14' },
]

export function ERPConfigTab({ ledger }: Props) {
  const { updateLedger, addToast } = useAppStore()
  const cfg = ledger.erpConfig!
  const [format, setFormat] = useState<ExportFormat>(cfg.format)
  const [frequency, setFrequency] = useState<ExportFrequency>(cfg.frequency)
  const [fieldMappings, setFieldMappings] = useState(cfg.fieldMappings.length ? cfg.fieldMappings : [{ source: '', target: '' }])
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    updateLedger(ledger.id, {
      erpConfig: { format, frequency, fieldMappings, configured: true }
    })
    addToast('success', 'Configuración ERP guardada (exportación disponible en Fase 2)')
    setLoading(false)
  }

  const updateMapping = (i: number, key: 'source' | 'target', value: string) =>
    setFieldMappings(p => p.map((m, idx) => idx === i ? { ...m, [key]: value } : m))

  const addRow = () => setFieldMappings(p => [...p, { source: '', target: '' }])
  const removeRow = (i: number) => setFieldMappings(p => p.filter((_, idx) => idx !== i))

  return (
    <div className="space-y-6 fade-in">
      {/* Phase 2 Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-[#969bbd] bg-[#f1f2f6]">
        <Info size={18} className="text-[#3e4983] mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-[#121e6c]">Exportación automática disponible en Fase 2</p>
          <p className="text-xs text-[#6c759f] mt-0.5">Puedes configurar los parámetros ahora. La exportación programada al ERP se habilitará en el próximo roadmap.</p>
        </div>
      </div>

      <Card>
        <h3 className="text-base font-bold text-[#121e6c] mb-4">Parámetros de Exportación</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Select
            label="Formato de exportación"
            options={FORMAT_OPTIONS}
            value={format}
            onChange={e => setFormat(e.target.value as ExportFormat)}
          />
          <Select
            label="Frecuencia"
            options={FREQUENCY_OPTIONS}
            value={frequency}
            onChange={e => setFrequency(e.target.value as ExportFrequency)}
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-[#121e6c]">Mapeo de Campos (Ledger → ERP)</p>
            <button onClick={addRow} className="text-sm font-semibold text-[#121e6c] hover:text-[#ee424e] flex items-center gap-1 transition-colors">
              <Plus size={14} /> Agregar campo
            </button>
          </div>
          <div className="space-y-2">
            {fieldMappings.map((m, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_1fr_auto] gap-2 items-center">
                <input
                  value={m.source}
                  onChange={e => updateMapping(i, 'source', e.target.value)}
                  placeholder="Campo ledger (ej: transaction_id)"
                  className="h-10 px-3 rounded-lg border border-[#d2d4e1] text-sm font-mono text-[#121e6c] focus:outline-none focus:border-[#121e6c] bg-white"
                />
                <span className="text-[#969bbd] text-sm">→</span>
                <input
                  value={m.target}
                  onChange={e => updateMapping(i, 'target', e.target.value)}
                  placeholder="Campo ERP (ej: TRANS_ID)"
                  className="h-10 px-3 rounded-lg border border-[#d2d4e1] text-sm font-mono text-[#121e6c] focus:outline-none focus:border-[#121e6c] bg-white"
                />
                <button
                  onClick={() => removeRow(i)}
                  disabled={fieldMappings.length === 1}
                  className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#969bbd] hover:text-[#ee424e] transition-colors disabled:opacity-30"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="border border-[#d2d4e1] rounded-lg overflow-hidden mb-6">
          <p className="text-xs font-semibold text-[#6c759f] px-4 py-2 bg-[#f1f2f6]">
            Preview archivo exportado ({format}) – primeras 3 líneas
          </p>
          {format === 'CSV' && (
            <div className="p-4 font-mono text-xs text-[#121e6c] bg-white">
              <p className="text-[#6c759f]">TRANS_ID,MONTO,TIPO,FECHA</p>
              {PREVIEW_DATA.map(r => (
                <p key={r.TRANS_ID}>{r.TRANS_ID},{r.MONTO},{r.TIPO},{r.FECHA}</p>
              ))}
            </div>
          )}
          {format === 'JSON' && (
            <pre className="p-4 text-xs text-[#121e6c] bg-white overflow-auto">
              {JSON.stringify(PREVIEW_DATA, null, 2)}
            </pre>
          )}
          {format === 'XML' && (
            <div className="p-4 font-mono text-xs text-[#121e6c] bg-white">
              <p className="text-[#6c759f]">&lt;transactions&gt;</p>
              {PREVIEW_DATA.map(r => (
                <div key={r.TRANS_ID} className="ml-2">
                  <p>&lt;transaction&gt;</p>
                  <p className="ml-2">&lt;TRANS_ID&gt;{r.TRANS_ID}&lt;/TRANS_ID&gt;</p>
                  <p className="ml-2">&lt;MONTO&gt;{r.MONTO}&lt;/MONTO&gt;</p>
                  <p>&lt;/transaction&gt;</p>
                </div>
              ))}
              <p className="text-[#6c759f]">&lt;/transactions&gt;</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${cfg.configured ? 'bg-[#4caf50]' : 'bg-[#969bbd]'}`} />
            <span className="text-sm text-[#6c759f]">
              Estado: <span className="font-semibold text-[#121e6c]">{cfg.configured ? 'Configurado' : 'No configurado'}</span>
            </span>
          </div>
          <Button onClick={handleSave} loading={loading}>Guardar Configuración</Button>
        </div>
      </Card>
    </div>
  )
}
