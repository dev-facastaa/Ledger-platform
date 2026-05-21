import { useState } from 'react'
import { Plus, Search, BookOpen, Edit2, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { CreateLedgerModal } from './CreateLedgerModal'
import type { LedgerStatus } from '../../types'
import { PRODUCTS } from '../../services/mock/ledgers'

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'borrador', label: 'Borrador' },
]

const PRODUCT_OPTIONS = [
  { value: '', label: 'Todos los productos' },
  ...PRODUCTS.map(p => ({ value: p, label: p })),
]

export function LedgerList() {
  const { ledgers } = useAppStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LedgerStatus | ''>('')
  const [productFilter, setProductFilter] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const filtered = ledgers.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || l.status === statusFilter
    const matchProduct = !productFilter || l.product === productFilter
    return matchSearch && matchStatus && matchProduct
  })

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="fade-in">
      <PageHeader
        title="Ledgers"
        breadcrumbs={[{ label: 'Ledgers' }]}
        actions={
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={18} />
            Crear Ledger
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
                placeholder="Buscar por nombre..."
                className="h-12 w-full pl-10 pr-4 rounded-lg border border-[#d2d4e1] text-sm focus:outline-none focus:border-2 focus:border-[#121e6c] bg-white text-[#121e6c] placeholder:text-[#969bbd]"
              />
            </div>
          </div>
          <div className="w-48">
            <Select
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as LedgerStatus | '')}
            />
          </div>
          <div className="w-56">
            <Select
              options={PRODUCT_OPTIONS}
              value={productFilter}
              onChange={e => setProductFilter(e.target.value)}
            />
          </div>
          <p className="text-sm text-[#6c759f]">
            {filtered.length} ledger{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </Card>

      {/* Table */}
      <Card padding={false}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={28} />}
            title="No se encontraron ledgers"
            description="Ajusta los filtros o crea un nuevo ledger para comenzar."
            action={{ label: 'Crear Ledger', onClick: () => setShowCreate(true) }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#f1f2f6', borderBottom: '2px solid #d2d4e1' }}>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#121e6c]">Nombre</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#121e6c]">Producto</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#121e6c]">Estado</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#121e6c]">Configs</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#121e6c]">Última modificación</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#121e6c]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ledger => (
                  <tr
                    key={ledger.id}
                    className="border-b border-[#d2d4e1] hover:bg-[#fdeaeb] transition-colors cursor-pointer"
                    onClick={() => navigate(`/ledgers/${ledger.id}`)}
                  >
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-[#121e6c]">{ledger.name}</p>
                      {ledger.description && (
                        <p className="text-xs text-[#6c759f] truncate max-w-xs">{ledger.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#121e6c]">{ledger.product}</td>
                    <td className="px-4 py-4"><Badge status={ledger.status} /></td>
                    <td className="px-4 py-4 text-sm text-[#6c759f]">{ledger.configs.length} tipo{ledger.configs.length !== 1 ? 's' : ''}</td>
                    <td className="px-4 py-4 text-sm text-[#6c759f]">{formatDate(ledger.updatedAt)}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          className="p-2 rounded-lg hover:bg-[#f1f2f6] text-[#6c759f] hover:text-[#121e6c] transition-colors"
                          onClick={() => navigate(`/ledgers/${ledger.id}`)}
                          title="Ver detalle"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-[#f1f2f6] text-[#6c759f] hover:text-[#121e6c] transition-colors"
                          onClick={() => navigate(`/ledgers/${ledger.id}`)}
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <CreateLedgerModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}
