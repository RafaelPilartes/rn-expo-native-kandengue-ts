import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandMMKVStorage } from './zustandMMKVStorage'
import { AUTH_STORAGE_ID } from '../constants'
import { UserInterface } from '@/interfaces/IUser'
import { WalletInterface } from '@/interfaces/IWallet'

interface AuthState {
  user: UserInterface | null
  isFirstTime: boolean

  // Actions
  setUser: (user: UserInterface | null) => void
  logout: () => void
  setFirstTime: (isFirstTime: boolean) => void
}

const INITIAL_STATE: Omit<AuthState, 'setUser' | 'logout' | 'setFirstTime'> = {
  user: null,
  isFirstTime: true
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      ...INITIAL_STATE,

      setUser: user => set({ user }),

      logout: () => set({ user: null }),

      setFirstTime: isFirstTime => set({ isFirstTime })
    }),
    {
      name: AUTH_STORAGE_ID,
      storage: createJSONStorage(() => zustandMMKVStorage)
    }
  )
)

// Helper (opcional) — útil em hooks/viewmodels:
export const useIsAuthenticated = () => !!useAuthStore(s => s.user)
