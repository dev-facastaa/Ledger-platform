import { useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { useAppStore } from '../../store'
import { useNavigate } from 'react-router-dom'
import type { Ledger } from '../../types'
import { PRODUCTS } from '../../services/mock/ledgers'

interface Props {
  open: boolean
  onClose: () => void
}

const NAME_REGEX = /^[a-zA-Z0-9_-]+$/

export function CreateLedgerModal({ open, onClose }: Props) {
  const { ledgers, addLedger, addToast, currentUser } = useAppStore()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [product, setProduct] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'El nombre es obligatorio'
    else if (name.length > 100) e.name = 'Máximo 100 caracteres'
    else if (!NAME_REGEX.test(name)) e.name = 'Solo letras, números, guiones y underscores'
    else if (ledgers.some(l => l.name === name)) e.name = 'Ya existe un ledger con este nombre'
    if (!product) e.product = 'Selecciona un producto'
    if (description.length > 500) e.description = 'Máximo 500 caracteres'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const newLedger: Ledger = {
      id: `ldg-${crypto.randomUUID().slice(0, 8)}`,
      name: name.trim(),
      product,
      description: description.trim() || undefined,
      status: 'borrador',
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
    setName(''); setProduct(''); setDescription(''); setErrors({})
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
        <Select
          label="Producto Asociado *"
          value={product}
          onChange={e => { setProduct(e.target.value); setErrors(p => ({ ...p, product: '' })) }}
          options={PRODUCTS.map(p => ({ value: p, label: p }))}
          placeholder="Selecciona un producto..."
          error={errors.product}
        />
        <Textarea
          label="Descripción"
          value={description}
          onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: '' })) }}
          placeholder="Describe el propósito de este ledger..."
          rows={3}
          error={errors.description}
          helper={`${description.length}/500 caracteres`}
        />
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#f1f2f6]">
          <span className="w-2 h-2 rounded-full bg-[#ff9800]" />
          <p className="text-sm text-[#6c759f]">Estado inicial: <span className="font-semibold text-[#121e6c]">Borrador</span></p>
        </div>
      </div>
    </Modal>
  )
}
