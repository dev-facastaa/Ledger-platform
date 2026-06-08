import React from 'react'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: '#F1F2F6', color: '#969696' }}
        >
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2" style={{ color: '#121E6C' }}>{title}</h3>
      {description && (
        <p className="text-sm mb-6 max-w-xs" style={{ color: '#606060' }}>{description}</p>
      )}
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  )
}
