import 'i18next';
import common from '@/locales/en/common.json';
import auth from '@/locales/en/auth.json';
import tab from '@/locales/en/tab-nav.json';
import onboarding from '@/locales/en/onboarding.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      auth: typeof auth;
      tab: typeof tab;
      onboarding: typeof onboarding;
    };
    allowObjectInHTMLChildren: true;
  }
}

export type I18nNamespace = 'common' | 'auth' | 'tab' | 'onboarding';
