import { useState, useRef, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { ToastContainer } from './Toast'
import { useAppStore } from '../../store'
import type { LedgerCountry } from '../../types'

const COUNTRIES: { value: LedgerCountry; flag: string; label: string }[] = [
  { value: 'colombia', flag: '🇨🇴', label: 'Colombia' },
  { value: 'peru',     flag: '🇵🇪', label: 'Perú' },
]

function CountrySelector() {
  const { selectedCountry, setCountry } = useAppStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = COUNTRIES.find(c => c.value === selectedCountry)!
  const other   = COUNTRIES.find(c => c.value !== selectedCountry)!

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      {/* Botón — país activo */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 transition-colors"
        style={{
          border: '1px solid #F1F2F6',
          borderRadius: '8px',
          background: '#FFFFFF',
          color: '#121E6C',
          fontSize: '13px',
          fontWeight: 600,
          lineHeight: '20px',
        }}
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown
          size={14}
          style={{
            color: '#606060',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 150ms',
          }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-1 py-1 fade-in"
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0px 4px 12px 0px rgba(18,30,108,0.08)',
            minWidth: '140px',
            zIndex: 50,
          }}
        >
          <button
            onClick={() => { setCountry(other.value); setOpen(false) }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-left transition-colors"
            style={{ fontSize: '13px', fontWeight: 500, color: '#121E6C' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F7F8FB')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <span>{other.flag}</span>
            <span>{other.label}</span>
          </button>
        </div>
      )}
    </div>
  )
}

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto flex flex-col" style={{ background: '#F7F8FB' }}>
        {/* Barra superior con selector de país */}
        <div
          className="flex items-center justify-end px-8 shrink-0"
          style={{
            height: '44px',
            background: '#FFFFFF',
            borderBottom: '1px solid #F1F2F6',
          }}
        >
          <CountrySelector />
        </div>

        {/* Contenido de la página */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
            <Outlet />
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  )
}
