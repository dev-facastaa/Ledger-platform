import type { LedgerStatus, TxnStatus } from '../../types'

interface BadgeProps {
  status: LedgerStatus | TxnStatus | string
  className?: string
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  activo: { label: 'Activo', bg: '#4caf50', text: 'white' },
  inactivo: { label: 'Inactivo', bg: '#969bbd', text: 'white' },
  borrador: { label: 'Borrador', bg: '#ff9800', text: 'white' },
  processed: { label: 'Procesado', bg: '#4caf50', text: 'white' },
  failed: { label: 'Fallido', bg: '#ee424e', text: 'white' },
  pending: { label: 'Pendiente', bg: '#ff9800', text: 'white' },
  activa: { label: 'Activa', bg: '#4caf50', text: 'white' },
  inactiva: { label: 'Inactiva', bg: '#969bbd', text: 'white' },
}

export function Badge({ status, className = '' }: BadgeProps) {
  const config = statusConfig[status] ?? { label: status, bg: '#d2d4e1', text: '#121e6c' }
  return (
    <span
      className={`inline-flex items-center h-6 px-3 rounded-xl text-xs font-semibold ${className}`}
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  )
}

interface AlertBadgeProps {
  severity: 'warning' | 'critical'
}

export function AlertBadge({ severity }: AlertBadgeProps) {
  return (
    <span
      className="inline-flex items-center h-6 px-3 rounded-xl text-xs font-semibold"
      style={{
        backgroundColor: severity === 'critical' ? '#ee424e' : '#ff9800',
        color: 'white',
      }}
    >
      {severity === 'critical' ? 'Crítico' : 'Advertencia'}
    </span>
  )
}
