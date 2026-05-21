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
        <div className="w-16 h-16 rounded-full bg-[#f1f2f6] flex items-center justify-center mb-4 text-[#969bbd]">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#121e6c] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#6c759f] mb-6 max-w-xs">{description}</p>}
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  )
}
