import { create } from 'zustand'
import type { Ledger, Account } from '../types'
import { mockLedgers } from '../services/mock/ledgers'
import { mockAccounts } from '../services/mock/accounts'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning'
  message: string
}

interface AppStore {
  ledgers: Ledger[]
  accounts: Account[]
  toasts: Toast[]
  currentUser: string
  addLedger: (ledger: Ledger) => void
  updateLedger: (id: string, updates: Partial<Ledger>) => void
  addToast: (type: Toast['type'], message: string) => void
  removeToast: (id: string) => void
  addAccount: (account: Account) => void
}

export const useAppStore = create<AppStore>((set) => ({
  ledgers: mockLedgers,
  accounts: mockAccounts,
  toasts: [],
  currentUser: 'maria.lopez@bold.co',

  addLedger: (ledger) =>
    set((s) => ({ ledgers: [ledger, ...s.ledgers] })),

  updateLedger: (id, updates) =>
    set((s) => ({
      ledgers: s.ledgers.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l)),
    })),

  addToast: (type, message) => {
    const id = crypto.randomUUID()
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 4000)
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  addAccount: (account) =>
    set((s) => ({ accounts: [account, ...s.accounts] })),
}))
