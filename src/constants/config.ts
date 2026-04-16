import Constants from 'expo-constants'

// Busca a versão baseada no app.json (Garante que é sempre automática e verídica)
export const APP_VERSION = Constants.expoConfig?.version || '1.0.0'

// Busca o build number do iOS ou o versionCode do Android
export const BUILD_NUMBER =
  Constants.expoConfig?.ios?.buildNumber ||
  Constants.expoConfig?.android?.versionCode?.toString() ||
  '1'

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
