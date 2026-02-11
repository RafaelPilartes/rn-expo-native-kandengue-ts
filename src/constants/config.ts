import Constants from 'expo-constants'

export const APP_VERSION = '1.0.1'
export const BUILD_NUMBER = '8'
export const LAST_UPDATE = '13 Fev 2026'
export const SITE_URL = 'https://kandengueatrevido.ao'
export const DEVELOPER_SITE = 'https://rafaelpilartes.com'

// WhatsApp
export const WHATSAPP_NUMBER = '+244 923 456 789'
// Atendimento por voz
export const VOICE_NUMBER = '+244 922 456 789'
// Email
export const EMAIL_SUPPORT = 'support@kandengueatrevido.ao'

export const AppConfigInfo = {
  androidPackageName: Constants.expoConfig?.android?.package,
  iosBundleIdentifier: Constants.expoConfig?.ios?.bundleIdentifier
}
