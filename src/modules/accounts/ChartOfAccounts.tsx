import { useState } from 'react'
import { Plus, Search, Download } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Input, Select } from '../../components/ui/Input'
import { useAppStore } from '../../store'
import type { AccountType } from '../../types'

const TYPE_OPTIONS = [
  { value: '', label: 'Todos los tipos' },
  { value: 'activo', label: 'Activo' },
  { value: 'pasivo', label: 'Pasivo' },
  { value: 'ingreso', label: 'Ingreso' },
  { value: 'egreso', label: 'Egreso' },
  { value: 'patrimonio', label: 'Patrimonio' },
]

const TYPE_COLORS: Record<AccountType, string> = {
  activo: '#3e4983',
  pasivo: '#ff9800',
  ingreso: '#4caf50',
  egreso: '#ee424e',
  patrimonio: '#6c759f',
}

export function ChartOfAccounts() {
  const { accounts, addAccount, addToast } = useAppStore()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<AccountType | ''>('')
  const [showCreate, setShowCreate] = useState(false)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState<AccountType>('activo')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const filtered = accounts.filter(a => {
    const matchSearch = !search || a.code.includes(search) || a.name.toLowerCase().includes(search.toLowerCase())
    const matchType = !typeFilter || a.type === typeFilter
    return matchSearch && matchType
  })

  const handleExport = () => {
    const headers = 'Código,Nombre,Tipo,Estado\n'
    const rows = filtered.map(a => `${a.code},${a.name},${a.type},${a.status}`).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'puc.csv'; a.click()
    addToast('success', 'PUC exportado a CSV')
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!code.trim()) e.code = 'El código es obligatorio'
    else if (accounts.some(a => a.code === code)) e.code = 'Este código ya existe'
    if (!name.trim()) e.name = 'El nombre es obligatorio'
    return e
  }

  const handleCreate = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    addAccount({ code: code.trim(), name: name.trim(), type, status: 'activa' })
    addToast('success', `Cuenta ${code} – ${name} creada`)
    setLoading(false)
    setShowCreate(false)
    setCode(''); setName(''); setType('activo'); setErrors({})
  }

  return (
    <div className="fade-in">
      <PageHeader
        title="Plan de Cuentas (PUC)"
        breadcrumbs={[{ label: 'Plan de Cuentas' }]}
        actions={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleExport} size="sm">
              <Download size={16} /> Exportar CSV
            </Button>
            <Button onClick={() => setShowCreate(true)} size="sm">
              <Plus size={16} /> Nueva Cuenta
            </Button>
          </div>
        }
      />

      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#969bbd]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por código o nombre..."
                className="h-12 w-full pl-10 pr-4 rounded-lg border border-[#d2d4e1] text-sm focus:outline-none focus:border-2 focus:border-[#121e6c] bg-white text-[#121e6c] placeholder:text-[#969bbd]"
              />
            </div>
          </div>
          <div className="w-44">
            <Select options={TYPE_OPTIONS} value={typeFilter} onChange={e => setTypeFilter(e.target.value as AccountType | '')} />
          </div>
          <p className="text-sm text-[#6c759f]">{filtered.length} cuenta(s)</p>
        </div>
      </Card>

      <Card padding={false}>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#f1f2f6', borderBottom: '2px solid #d2d4e1' }}>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#121e6c]">Código</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#121e6c]">Nombre</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#121e6c]">Tipo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#121e6c]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(account => (
              <tr key={account.code} className="border-b border-[#d2d4e1] hover:bg-[#fdeaeb] transition-colors">
                <td className="px-4 py-3 font-mono text-sm font-semibold text-[#121e6c]">{account.code}</td>
                <td className="px-4 py-3 text-sm text-[#121e6c]">{account.name}</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center h-6 px-3 rounded-xl text-xs font-semibold text-white capitalize"
                    style={{ background: TYPE_COLORS[account.type] }}
                  >
                    {account.type}
                  </span>
                </td>
                <td className="px-4 py-3"><Badge status={account.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Nueva Cuenta Contable"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)} disabled={loading}>Cancelar</Button>
            <Button onClick={handleCreate} loading={loading}>Crear Cuenta</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Código *"
            value={code}
            onChange={e => { setCode(e.target.value); setErrors(p => ({ ...p, code: '' })) }}
            placeholder="1105"
            error={errors.code}
            helper="Código numérico único del PUC"
          />
          <Input
            label="Nombre *"
            value={name}
            onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
            placeholder="Caja"
            error={errors.name}
          />
          <Select
            label="Tipo"
            value={type}
            onChange={e => setType(e.target.value as AccountType)}
            options={[
              { value: 'activo', label: 'Activo' },
              { value: 'pasivo', label: 'Pasivo' },
              { value: 'ingreso', label: 'Ingreso' },
              { value: 'egreso', label: 'Egreso' },
              { value: 'patrimonio', label: 'Patrimonio' },
            ]}
          />
        </div>
      </Modal>
    </div>
  )
}
