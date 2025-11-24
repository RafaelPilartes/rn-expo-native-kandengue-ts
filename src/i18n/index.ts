import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as en from '@/locales/en';
import * as pt from '@/locales/pt';
import * as fr from '@/locales/fr';

import { useAppStore } from '@/storage/store/useAppStore';

// Traduções carregadas manualmente
const resources = {
  en: en as { [ns: string]: object },
  pt: pt as { [ns: string]: object },
  fr: fr as { [ns: string]: object },
};

// Idioma salvo no Zustand (mesmo antes de carregar o app)
const storedLang = useAppStore.getState().language;

// Configuração do i18n
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: storedLang, // 👈 idioma sincronizado com Zustand
  fallbackLng: 'pt',
  ns: Object.keys(en),
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
