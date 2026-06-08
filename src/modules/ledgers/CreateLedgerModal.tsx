import { useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { useAppStore } from '../../store'
import { useNavigate } from 'react-router-dom'
import type { Ledger, LedgerFrequency, LedgerCurrency, LedgerCompany } from '../../types'
import { FREQUENCIES, CURRENCIES, COMPANIES_BY_COUNTRY } from '../../services/mock/ledgers'

interface Props {
  open: boolean
  onClose: () => void
}

const NAME_REGEX = /^[a-zA-Z0-9_-]+$/

export function CreateLedgerModal({ open, onClose }: Props) {
  const { ledgers, addLedger, addToast, currentUser, selectedCountry } = useAppStore()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [company, setCompany] = useState<LedgerCompany | ''>('')
  const [frequency, setFrequency] = useState<LedgerFrequency | ''>('')
  const [currency, setCurrency] = useState<LedgerCurrency | ''>('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // Opciones de compañía filtradas según el país activo del header
  const companyOptions = COMPANIES_BY_COUNTRY[selectedCountry] ?? []

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'El nombre es obligatorio'
    else if (name.length > 100) e.name = 'Máximo 100 caracteres'
    else if (!NAME_REGEX.test(name)) e.name = 'Solo letras, números, guiones y underscores'
    else if (ledgers.some(l => l.name === name)) e.name = 'Ya existe un ledger con este nombre'
    if (!company) e.company = 'Selecciona una compañía'
    if (!currency) e.currency = 'Selecciona una moneda'
    if (!frequency) e.frequency = 'Selecciona una frecuencia'
    if (description.length > 500) e.description = 'Máximo 500 caracteres'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const newLedger: Omit<Ledger, 'internalId'> = {
      id: `ldg-${crypto.randomUUID().slice(0, 8)}`,
      name: name.trim(),
      product: '',                         // no requerido en creación
      description: description.trim() || undefined,
      status: 'borrador',
      country: selectedCountry,            // ← desde el selector global del header
      company: company as LedgerCompany,
      frequency: frequency as LedgerFrequency,
      currency: currency as LedgerCurrency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser,
      configs: [],
      erpConfig: { format: 'CSV', frequency: 'diaria', fieldMappings: [], configured: false },
    }
    addLedger(newLedger)
    addToast('success', `Ledger "${name}" creado exitosamente`)
    setLoading(false)
    handleClose()
    navigate(`/ledgers/${newLedger.id}`)
  }

  const handleClose = () => {
    setName(''); setCompany(''); setFrequency(''); setCurrency(''); setDescription(''); setErrors({})
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Crear Nuevo Ledger"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSubmit} loading={loading}>Guardar como borrador</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Nombre *"
          value={name}
          onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
          placeholder="cashout_express_ledger"
          error={errors.name}
          helper="Solo letras, números, guiones (-) y underscores (_)"
          maxLength={100}
        />

        {/* Compañía — reemplaza Producto Asociado; opciones filtradas por país activo */}
        <Select
          label="Compañía *"
          value={company}
          onChange={e => { setCompany(e.target.value as LedgerCompany | ''); setErrors(p => ({ ...p, company: '' })) }}
          options={companyOptions}
          placeholder="Selecciona una compañía..."
          error={errors.company}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Moneda *"
            value={currency}
            onChange={e => { setCurrency(e.target.value as LedgerCurrency | ''); setErrors(p => ({ ...p, currency: '' })) }}
            options={CURRENCIES}
            placeholder="Selecciona una moneda..."
            error={errors.currency}
          />
          <Select
            label="Frecuencia *"
            value={frequency}
            onChange={e => { setFrequency(e.target.value as LedgerFrequency | ''); setErrors(p => ({ ...p, frequency: '' })) }}
            options={FREQUENCIES}
            placeholder="Selecciona frecuencia..."
            error={errors.frequency}
          />
        </div>

        <Textarea
          label="Descripción"
          value={description}
          onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: '' })) }}
          placeholder="Describe el propósito de este ledger..."
          rows={3}
          error={errors.description}
          helper={`${description.length}/500 caracteres`}
        />

        <div className="flex items-center gap-2 px-4 py-3 rounded-lg" style={{ background: '#F3F3F3' }}>
          <span className="w-2 h-2 rounded-full" style={{ background: '#FFC217' }} />
          <p className="text-sm" style={{ color: '#606060' }}>
            Estado inicial: <span className="font-semibold" style={{ color: '#121E6C' }}>Borrador</span>
          </p>
        </div>
      </div>
    </Modal>
  )
}
