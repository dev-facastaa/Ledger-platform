import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: string
  footer?: React.ReactNode
}

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-xl', footer }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay — rgba(0,0,0,0.5) según Merlin */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />
      <div
        className={`relative bg-white w-full ${maxWidth} slide-in`}
        style={{
          borderRadius: '18px',
          padding: '32px',
          boxShadow: '0px 12px 28px 0px rgba(18,30,108,0.08)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div className="flex items-start justify-between mb-6">
          {/* Title/Large — 28px/400 Merlin */}
          <h3 style={{ fontSize: '28px', lineHeight: '32px', fontWeight: 400, color: '#121E6C' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#F1F2F6] transition-colors text-[#606060] hover:text-[#121E6C]"
          >
            <X size={20} />
          </button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirmar', variant = 'danger', loading }: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="text-base text-[#606060]">{message}</p>
    </Modal>
  )
}
