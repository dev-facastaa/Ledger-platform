import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BookOpen, Activity, Receipt, Shield, Database, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { useAppStore } from '../../store'

const navItems = [
  { to: '/ledgers', icon: BookOpen, label: 'Ledgers' },
  { to: '/monitoring', icon: Activity, label: 'Monitoreo' },
  { to: '/transactions', icon: Receipt, label: 'Transacciones' },
  { to: '/accounts', icon: Database, label: 'Plan de Cuentas' },
  { to: '/audit', icon: Shield, label: 'Auditoría' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { currentUser } = useAppStore()
  const initials = currentUser.split('.').map(s => s[0]?.toUpperCase()).join('')

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 shrink-0"
      style={{
        width: collapsed ? 72 : 280,
        background: '#121e6c',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #ee424e, #121e6c)' }}>
          <Zap size={20} color="white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-black text-sm leading-tight">Bold</p>
            <p className="text-[#969bbd] text-xs font-semibold">Finance Core · Ledger</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 mx-2 px-3 py-3 rounded-lg mb-1 transition-all duration-150 group
              ${isActive
                ? 'bg-[#ee424e] text-white border-l-4 border-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent'}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={20} strokeWidth={2} className="shrink-0" />
            {!collapsed && <span className="text-sm font-semibold">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#ee424e] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">{currentUser}</p>
              <p className="text-[#969bbd] text-xs">Admin FinOps</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full h-8 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span className="text-xs ml-2">Colapsar</span></>}
        </button>
      </div>
    </aside>
  )
}
