import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: boolean
}

export function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div
      className={`bg-white border border-[#d2d4e1] rounded-xl ${padding ? 'p-6' : ''} ${className}`}
      style={{ boxShadow: '0 2px 8px rgba(18, 30, 108, 0.08)' }}
    >
      {children}
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: React.ReactNode
  gradient?: boolean
}

export function MetricCard({ label, value, sub, icon, gradient }: MetricCardProps) {
  if (gradient) {
    return (
      <div
        className="rounded-xl p-6 text-white"
        style={{ background: 'linear-gradient(135deg, #121e6c 15%, #ee424e 85%)' }}
      >
        <div className="flex items-start justify-between mb-2">
          <p className="text-sm font-semibold opacity-80">{label}</p>
          {icon && <span className="opacity-70">{icon}</span>}
        </div>
        <p className="text-3xl font-black">{value}</p>
        {sub && <p className="text-sm opacity-70 mt-1">{sub}</p>}
      </div>
    )
  }
  return (
    <Card>
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-semibold text-[#6c759f]">{label}</p>
        {icon && <span className="text-[#121e6c]">{icon}</span>}
      </div>
      <p className="text-3xl font-black text-[#121e6c]">{value}</p>
      {sub && <p className="text-xs text-[#6c759f] mt-1">{sub}</p>}
    </Card>
  )
}
