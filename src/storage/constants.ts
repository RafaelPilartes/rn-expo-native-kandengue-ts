export enum STORAGE_TYPE {
  MMKV = 'mmkv',
  ASYNC = 'async'
}

// Altere aqui para mudar o mecanismo de armazenamento
export const CURRENT_STORAGE_TYPE = STORAGE_TYPE.MMKV
export const STORAGE_ID = '@kandengue:storage' // Criptografado
export const ZUSTAND_STORAGE_ID = '@kandengue:zustand' // Apenas para persistência do Zustand

// kandengue-app-settings
export const APP_SETTINGS_STORAGE_ID = '@kandengue:app-settings'
// kandengue-user
export const PERMISSIONS_USER_STORAGE_ID = '@kandengue:user'
// kandengue-auth
export const AUTH_STORAGE_ID = '@kandengue:auth'
// kandengue-pin
export const AUTH_STORAGE_PIN = '@kandengue:pin'
// kandengue-permissions
export const PERMISSIONS_STORAGE_ID = '@kandengue:permissions'
// kandengue-theme
export const THEME_STORAGE_ID = '@kandengue:theme'

export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  PIN: 'pin'
}
export const STORAGE_EXPIRATION = {
  USER: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  TOKEN: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  PIN: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
}
