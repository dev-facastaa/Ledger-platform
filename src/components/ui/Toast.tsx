import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react'
import { useAppStore } from '../../store'

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore()

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 bg-white border rounded-xl px-4 py-3 fade-in"
          style={{
            boxShadow: '0 8px 32px rgba(18, 30, 108, 0.16)',
            borderColor: toast.type === 'success' ? '#4caf50' : toast.type === 'error' ? '#ee424e' : '#ff9800',
            minWidth: '320px',
          }}
        >
          {toast.type === 'success' && <CheckCircle size={20} color="#4caf50" />}
          {toast.type === 'error' && <XCircle size={20} color="#ee424e" />}
          {toast.type === 'warning' && <AlertTriangle size={20} color="#ff9800" />}
          <p className="flex-1 text-sm font-semibold text-[#121e6c]">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="text-[#969bbd] hover:text-[#121e6c]">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
