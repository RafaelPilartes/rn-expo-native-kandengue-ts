import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { LanguageEnum } from '@/types/enum'
import { zustandMMKVStorage } from './zustandMMKVStorage'
import { APP_SETTINGS_STORAGE_ID } from '../constants'

export type AppSettings = {
  language: LanguageEnum
  isCamouflaged: boolean
}

type AppStore = AppSettings & {
  // Actions
  setLanguage: (lang: LanguageEnum) => void
  toggleCamouflage: () => void
  resetSettings: () => void
}

// Valores iniciais
const INITIAL_SETTINGS: AppSettings = {
  language: 'pt',
  isCamouflaged: false
}

export const useAppStore = create<AppStore>()(
  persist(
    set => ({
      ...INITIAL_SETTINGS,

      setLanguage: lang => set({ language: lang }),

      toggleCamouflage: () =>
        set(state => ({ isCamouflaged: !state.isCamouflaged })),

      resetSettings: () =>
        set(state => ({
          ...state,
          ...INITIAL_SETTINGS
        }))
    }),
    {
      name: APP_SETTINGS_STORAGE_ID,
      storage: createJSONStorage(() => zustandMMKVStorage)
    }
  )
)
