import { create } from 'zustand'
import type { Ledger, Account, LedgerCountry } from '../types'
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
  selectedCountry: LedgerCountry
  setCountry: (country: LedgerCountry) => void
  addLedger: (ledger: Omit<Ledger, 'internalId'>) => void
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
  selectedCountry: 'colombia',
  setCountry: (country) => set({ selectedCountry: country }),

  addLedger: (ledger) =>
    set((s) => {
      // internalId counter from length; collision risk if delete is added later
      const internalId = `LDG-${String(s.ledgers.length + 1).padStart(3, '0')}`
      const ledgerWithId = { ...ledger, internalId }
      return { ledgers: [ledgerWithId, ...s.ledgers] }
    }),

  updateLedger: (id, updates) =>
    set((s) => ({
      ledgers: s.ledgers.map((l) => {
        if (l.id !== id) return l
        const current = l
        if (current.status === 'inactivo' && (updates as Partial<Ledger>).status !== undefined) {
          updates = { ...updates }
          delete (updates as Partial<Ledger>).status
        }
        return { ...l, ...updates, updatedAt: new Date().toISOString() }
      }),
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
