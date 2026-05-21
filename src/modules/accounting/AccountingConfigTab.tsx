import { useState } from 'react'
import { Plus, Edit2, Trash2, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Modal, ConfirmModal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { useAppStore } from '../../store'
import type { Ledger, AccountingEntryConfig, FieldMapping, AccountNature } from '../../types'

interface Props { ledger: Ledger }

function BalanceIndicator({ mappings }: { mappings: FieldMapping[] }) {
  const debits = mappings.filter(m => m.nature === 'debito').length
  const credits = mappings.filter(m => m.nature === 'credito').length
  const balanced = debits > 0 && credits > 0 && debits === credits
  const hasAny = mappings.length > 0

  if (!hasAny) return null
  return (
    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${balanced ? 'bg-green-50' : 'bg-amber-50'}`}>
      {balanced
        ? <CheckCircle size={16} color="#4caf50" />
        : <AlertTriangle size={16} color="#ff9800" />}
      <span className={`text-sm font-semibold ${balanced ? 'text-green-700' : 'text-amber-700'}`}>
        {balanced
          ? 'Partida doble balanceada ✓'
          : `Desbalanceada: ${debits} débito(s) vs ${credits} crédito(s)`}
      </span>
    </div>
  )
}

function AccountingPreview({ mappings }: { mappings: FieldMapping[] }) {
  if (mappings.length === 0) return null
  const EXAMPLE = 100000
  return (
    <div className="border border-[#d2d4e1] rounded-lg overflow-hidden">
      <p className="text-xs font-semibold text-[#6c759f] px-4 py-2 bg-[#f1f2f6]">Preview de asiento (ejemplo: $100.000)</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#f1f2f6] border-b border-[#d2d4e1]">
            <th className="text-left px-4 py-2 text-xs font-semibold text-[#121e6c]">Cuenta</th>
            <th className="text-right px-4 py-2 text-xs font-semibold text-[#121e6c]">Débito</th>
            <th className="text-right px-4 py-2 text-xs font-semibold text-[#121e6c]">Crédito</th>
          </tr>
        </thead>
        <tbody>
          {mappings.map(m => (
            <tr key={m.id} className="border-b border-[#d2d4e1]">
              <td className="px-4 py-2 text-[#121e6c]">{m.accountCode} {m.accountName}</td>
              <td className="px-4 py-2 text-right text-[#121e6c]">{m.nature === 'debito' ? `$${EXAMPLE.toLocaleString('es-CO')}` : ''}</td>
              <td className="px-4 py-2 text-right text-[#121e6c]">{m.nature === 'credito' ? `$${EXAMPLE.toLocaleString('es-CO')}` : ''}</td>
            </tr>
          ))}
          <tr className="bg-[#f1f2f6]">
            <td className="px-4 py-2 text-xs font-bold text-[#121e6c]">Total</td>
            <td className="px-4 py-2 text-right text-xs font-bold text-[#121e6c]">
              ${(mappings.filter(m => m.nature === 'debito').length * EXAMPLE).toLocaleString('es-CO')}
            </td>
            <td className="px-4 py-2 text-right text-xs font-bold text-[#121e6c]">
              ${(mappings.filter(m => m.nature === 'credito').length * EXAMPLE).toLocaleString('es-CO')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export function AccountingConfigTab({ ledger }: Props) {
  const { updateLedger, accounts, addToast } = useAppStore()
  const [showModal, setShowModal] = useState(false)
  const [editingConfig, setEditingConfig] = useState<AccountingEntryConfig | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [txType, setTxType] = useState('')
  const [description, setDescription] = useState('')
  const [mappings, setMappings] = useState<FieldMapping[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const openCreate = () => {
    setEditingConfig(null)
    setTxType(''); setDescription('')
    setMappings([{ id: crypto.randomUUID(), fieldName: '', accountCode: '', accountName: '', nature: 'debito' }])
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (cfg: AccountingEntryConfig) => {
    setEditingConfig(cfg)
    setTxType(cfg.transactionType)
    setDescription(cfg.description || '')
    setMappings(cfg.fieldMappings.map(m => ({ ...m })))
    setErrors({})
    setShowModal(true)
  }

  const addMapping = () =>
    setMappings(p => [...p, { id: crypto.randomUUID(), fieldName: '', accountCode: '', accountName: '', nature: 'debito' }])

  const removeMapping = (id: string) =>
    setMappings(p => p.filter(m => m.id !== id))

  const updateMapping = (id: string, key: keyof FieldMapping, value: string) => {
    setMappings(p => p.map(m => {
      if (m.id !== id) return m
      if (key === 'accountCode') {
        const acc = accounts.find(a => a.code === value)
        return { ...m, accountCode: value, accountName: acc?.name || '' }
      }
      return { ...m, [key]: value }
    }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!txType.trim()) e.txType = 'El tipo de transacción es obligatorio'
    else if (ledger.configs.some(c => c.transactionType === txType && c.id !== editingConfig?.id))
      e.txType = 'Este tipo ya existe en el ledger'
    if (mappings.some(m => !m.fieldName || !m.accountCode))
      e.mappings = 'Todos los campos deben tener nombre y cuenta'
    return e
  }

  const handleSave = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))

    const newConfig: AccountingEntryConfig = {
      id: editingConfig?.id || crypto.randomUUID(),
      ledgerId: ledger.id,
      transactionType: txType.trim(),
      description: description.trim() || undefined,
      fieldMappings: mappings,
      createdAt: editingConfig?.createdAt || new Date().toISOString(),
      version: (editingConfig?.version || 0) + (editingConfig ? 1 : 1),
    }

    const updatedConfigs = editingConfig
      ? ledger.configs.map(c => (c.id === editingConfig.id ? newConfig : c))
      : [...ledger.configs, newConfig]

    updateLedger(ledger.id, { configs: updatedConfigs })
    addToast('success', editingConfig ? 'Configuración actualizada' : 'Configuración creada exitosamente')
    setLoading(false)
    setShowModal(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    updateLedger(ledger.id, { configs: ledger.configs.filter(c => c.id !== deleteTarget) })
    addToast('success', 'Configuración eliminada')
    setLoading(false)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-4 fade-in">
      <div className="flex justify-between items-center">
        <p className="text-sm text-[#6c759f]">{ledger.configs.length} tipo(s) de transacción configurados</p>
        <Button onClick={openCreate} size="sm">
          <Plus size={16} /> Agregar tipo de transacción
        </Button>
      </div>

      {ledger.configs.length === 0 ? (
        <Card>
          <EmptyState
            title="Sin configuración contable"
            description="Agrega al menos un tipo de transacción para poder activar este ledger."
            action={{ label: 'Agregar tipo de transacción', onClick: openCreate }}
          />
        </Card>
      ) : (
        ledger.configs.map(cfg => (
          <Card key={cfg.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-[#121e6c]">{cfg.transactionType}</h3>
                  <span className="text-xs text-[#969bbd] bg-[#f1f2f6] px-2 py-0.5 rounded-full">v{cfg.version}</span>
                </div>
                {cfg.description && <p className="text-sm text-[#6c759f]">{cfg.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(cfg)} className="p-2 rounded-lg hover:bg-[#f1f2f6] text-[#6c759f] hover:text-[#121e6c] transition-colors" title="Editar">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => setDeleteTarget(cfg.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#6c759f] hover:text-[#ee424e] transition-colors" title="Eliminar">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <table className="w-full text-sm mb-3">
              <thead>
                <tr className="border-b border-[#d2d4e1]">
                  <th className="text-left py-2 text-xs font-semibold text-[#6c759f]">Campo Monetario</th>
                  <th className="text-left py-2 text-xs font-semibold text-[#6c759f]">Cuenta Contable</th>
                  <th className="text-left py-2 text-xs font-semibold text-[#6c759f]">Naturaleza</th>
                </tr>
              </thead>
              <tbody>
                {cfg.fieldMappings.map(m => (
                  <tr key={m.id} className="border-b border-[#f1f2f6]">
                    <td className="py-2 font-mono text-[#121e6c] text-xs">{m.fieldName}</td>
                    <td className="py-2 text-[#121e6c]">{m.accountCode} – {m.accountName}</td>
                    <td className="py-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.nature === 'debito' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {m.nature === 'debito' ? 'Débito' : 'Crédito'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <BalanceIndicator mappings={cfg.fieldMappings} />
          </Card>
        ))
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingConfig ? 'Editar Configuración' : 'Nueva Configuración Contable'}
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>Cancelar</Button>
            <Button onClick={handleSave} loading={loading}>Guardar Configuración</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Tipo de Transacción *"
            value={txType}
            onChange={e => { setTxType(e.target.value); setErrors(p => ({ ...p, txType: '' })) }}
            placeholder="cashout_high_amount"
            error={errors.txType}
            helper="Debe coincidir exactamente con el transaction_type del payload API"
          />
          <Input
            label="Descripción"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe este tipo de transacción..."
          />

          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-semibold text-[#121e6c]">Mapeo de Campos Monetarios</p>
              <button onClick={addMapping} className="text-sm text-[#121e6c] font-semibold hover:text-[#ee424e] flex items-center gap-1 transition-colors">
                <Plus size={14} /> Agregar campo
              </button>
            </div>
            {errors.mappings && <p className="text-xs font-semibold text-[#ee424e] mb-2">{errors.mappings}</p>}
            <div className="space-y-2">
              {mappings.map((m, i) => (
                <div key={m.id} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-start">
                  <div>
                    {i === 0 && <p className="text-xs font-semibold text-[#6c759f] mb-1">Campo</p>}
                    <input
                      value={m.fieldName}
                      onChange={e => updateMapping(m.id, 'fieldName', e.target.value)}
                      placeholder="amount_principal"
                      className="h-10 px-3 w-full rounded-lg border border-[#d2d4e1] text-sm font-mono text-[#121e6c] focus:outline-none focus:border-[#121e6c] bg-white"
                    />
                  </div>
                  <div>
                    {i === 0 && <p className="text-xs font-semibold text-[#6c759f] mb-1">Cuenta</p>}
                    <select
                      value={m.accountCode}
                      onChange={e => updateMapping(m.id, 'accountCode', e.target.value)}
                      className="h-10 px-3 w-full rounded-lg border border-[#d2d4e1] text-sm text-[#121e6c] focus:outline-none focus:border-[#121e6c] bg-white cursor-pointer"
                    >
                      <option value="">Seleccionar cuenta...</option>
                      {accounts.filter(a => a.status === 'activa').map(a => (
                        <option key={a.code} value={a.code}>{a.code} – {a.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    {i === 0 && <p className="text-xs font-semibold text-[#6c759f] mb-1">Naturaleza</p>}
                    <select
                      value={m.nature}
                      onChange={e => updateMapping(m.id, 'nature', e.target.value as AccountNature)}
                      className="h-10 px-3 rounded-lg border border-[#d2d4e1] text-sm text-[#121e6c] focus:outline-none focus:border-[#121e6c] bg-white cursor-pointer"
                    >
                      <option value="debito">Débito</option>
                      <option value="credito">Crédito</option>
                    </select>
                  </div>
                  <div>
                    {i === 0 && <p className="text-xs opacity-0 mb-1">x</p>}
                    <button
                      onClick={() => removeMapping(m.id)}
                      disabled={mappings.length === 1}
                      className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#969bbd] hover:text-[#ee424e] transition-colors disabled:opacity-30"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <BalanceIndicator mappings={mappings} />
          <AccountingPreview mappings={mappings} />
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar Configuración"
        message="¿Estás seguro de que deseas eliminar este tipo de transacción? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        loading={loading}
      />
    </div>
  )
}
