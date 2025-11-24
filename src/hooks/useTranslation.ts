// src/hooks/useTranslation.ts
import { useMemo } from 'react'
import { useTranslation as useOriginalTranslation } from 'react-i18next'
import { I18nNamespace } from '@/types/i18next'
import { useAppStore } from '@/storage/store/useAppStore'
import { LanguageEnum } from '@/types/enum'

export const useTranslation = (ns?: I18nNamespace | I18nNamespace[]) => {
  const { t, i18n, ready } = useOriginalTranslation(ns)

  const { setLanguage } = useAppStore()

  const toggleLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setLanguage(lng as LanguageEnum)
  }

  return useMemo(
    () => ({
      t,
      i18n,
      ready,
      currentLanguage: i18n.language,
      changeLanguage: (lng: LanguageEnum) => toggleLanguage(lng)
    }),
    [t, i18n, ready]
  )
}
