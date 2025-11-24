// src/storage/store/useThemeStore.ts
import { create } from 'zustand'
import { Appearance } from 'react-native'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandMMKVStorage } from './zustandMMKVStorage'
import { THEME_STORAGE_ID } from '../constants'

type AppTheme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: AppTheme // Preferência do usuário
  resolvedTheme: 'light' | 'dark' // O que está ativo agora
  setTheme: (theme: AppTheme) => void
  updateResolvedTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: Appearance.getColorScheme() || 'light',

      setTheme: theme => {
        const sysTheme = Appearance.getColorScheme() || 'light'

        set({
          theme,
          resolvedTheme: theme === 'system' ? sysTheme : theme
        })
      },

      updateResolvedTheme: () => {
        const { theme } = get()
        const sysTheme = Appearance.getColorScheme() || 'light'

        set({
          resolvedTheme: theme === 'system' ? sysTheme : theme
        })
      }
    }),
    {
      name: THEME_STORAGE_ID,
      storage: createJSONStorage(() => zustandMMKVStorage)
    }
  )
)
