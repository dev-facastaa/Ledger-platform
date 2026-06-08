import { CheckCircle, XCircle, AlertTriangle, Info, Clock, X } from 'lucide-react'
import { useAppStore } from '../../store'

// Colores de ícono por variante sobre fondo oscuro #3F3F3F
const toastConfig = {
  success: { icon: CheckCircle, color: '#1B8959' },
  error:   { icon: XCircle,     color: '#910022' },
  warning: { icon: AlertTriangle, color: '#FFC217' },
  info:    { icon: Info,         color: '#0A53A5' },
  pending: { icon: Clock,        color: '#969696' },
} as const

type ToastType = keyof typeof toastConfig

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore()

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => {
        const type = (toast.type as ToastType) in toastConfig ? (toast.type as ToastType) : 'info'
        const { icon: Icon, color } = toastConfig[type]
        return (
          <div
            key={toast.id}
            className="flex items-center gap-3 fade-in"
            style={{
              background: '#3F3F3F',
              borderRadius: '16px',
              padding: '12px 16px',
              width: '351px',
              minHeight: '64px',
            }}
          >
            <Icon size={20} color={color} className="shrink-0" />
            <p style={{ flex: 1, fontSize: '12px', fontWeight: 600, color: '#FFFFFF', lineHeight: '16px' }}>
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/50 hover:text-white transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
