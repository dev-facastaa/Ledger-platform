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
                  <Link to={b.to} className="text-sm transition-colors" style={{ color: '#606060' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#121E6C')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#606060')}
                  >
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-sm font-semibold" style={{ color: '#121E6C' }}>{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && (
                  <ChevronRight size={14} style={{ color: '#969696' }} />
                )}
              </span>
            ))}
          </div>
        )}
        {/* Title/Large Merlin: 28px / 400 */}
        <h1 style={{ fontSize: '28px', lineHeight: '32px', fontWeight: 400, color: '#121E6C', margin: 0 }}>
          {title}
        </h1>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
