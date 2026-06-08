import type { LedgerStatus, TxnStatus } from '../../types'

interface BadgeProps {
  status: LedgerStatus | TxnStatus | string
  className?: string
}

// Tokens Merlin Feedback — fondo semántico + texto oscuro (no filled sólido)
const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  // Success
  activo:     { label: 'Activo',     bg: '#F4FDF9', text: '#1B8959' },
  activa:     { label: 'Activa',     bg: '#F4FDF9', text: '#1B8959' },
  processed:  { label: 'Procesado',  bg: '#F4FDF9', text: '#1B8959' },
  exitoso:    { label: 'Exitoso',    bg: '#F4FDF9', text: '#1B8959' },
  // Warning
  borrador:   { label: 'Borrador',   bg: '#FFF3D1', text: '#5B3100' },
  pending:    { label: 'Pendiente',  bg: '#FFF3D1', text: '#5B3100' },
  pendiente:  { label: 'Pendiente',  bg: '#FFF3D1', text: '#5B3100' },
  // Error
  inactivo:   { label: 'Inactivo',   bg: '#FBF3F5', text: '#910022' },
  inactiva:   { label: 'Inactiva',   bg: '#FBF3F5', text: '#910022' },
  failed:     { label: 'Fallido',    bg: '#FBF3F5', text: '#910022' },
  rechazado:  { label: 'Rechazado',  bg: '#FBF3F5', text: '#910022' },
  // Informative
  abierto:    { label: 'Abierto',    bg: '#F1F9FF', text: '#0A53A5' },
  // Neutral / cerrado
  cerrado:    { label: 'Cerrado',    bg: '#F3F3F3', text: '#969696' },
  neutral:    { label: 'Neutral',    bg: '#F3F3F3', text: '#969696' },
}

export function Badge({ status, className = '' }: BadgeProps) {
  const config = statusConfig[status] ?? { label: status, bg: '#F3F3F3', text: '#969696' }
  return (
    <span
      className={`inline-flex items-center px-3 rounded-[100px] ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        height: '24px',
        fontSize: '12px',
        fontWeight: 700,
        lineHeight: '16px',
      }}
    >
      {config.label}
    </span>
  )
}

interface AlertBadgeProps {
  severity: 'warning' | 'critical'
}

export function AlertBadge({ severity }: AlertBadgeProps) {
  const isCritical = severity === 'critical'
  return (
    <span
      className="inline-flex items-center px-3 rounded-[100px]"
      style={{
        backgroundColor: isCritical ? '#FBF3F5' : '#FFF3D1',
        color: isCritical ? '#910022' : '#5B3100',
        height: '24px',
        fontSize: '12px',
        fontWeight: 700,
        lineHeight: '16px',
      }}
    >
      {isCritical ? 'Crítico' : 'Advertencia'}
    </span>
  )
}
