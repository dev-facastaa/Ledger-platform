import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Breadcrumb {
  label: string
  to?: string
}

interface PageHeaderProps {
  title: string
  breadcrumbs?: Breadcrumb[]
  actions?: React.ReactNode
}

export function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 mb-1">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {b.to ? (
                  <Link to={b.to} className="text-sm text-[#6c759f] hover:text-[#121e6c] transition-colors">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-sm font-semibold text-[#121e6c]">{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <ChevronRight size={14} className="text-[#d2d4e1]" />}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-2xl font-black text-[#121e6c]">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
