// services/permissions/locationPermission.ts
import { Platform, PermissionsAndroid } from 'react-native'
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission
} from 'react-native-permissions'

export interface LocationPermissionResponse {
  granted: boolean
  denied: boolean
  blocked: boolean
  unavailable?: boolean
}

// 🔹 CORREÇÃO: Tipo mais seguro para as permissões
type PlatformPermissions = {
  ios: Permission
  android: Permission
}

const locationPermissions: PlatformPermissions = {
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
}

// 🔹 CORREÇÃO: Função auxiliar para obter permissão segura
const getLocationPermission = (): Permission | null => {
  const platform = Platform.OS as keyof PlatformPermissions

  if (platform in locationPermissions) {
    return locationPermissions[platform]
  }

  console.warn(
    `Plataforma ${platform} não suportada para permissões de localização`
  )
  return null
}

export const checkLocationPermission =
  async (): Promise<LocationPermissionResponse> => {
    try {
      const permission = getLocationPermission()

      // If running on an unsupported platform, report as unavailable
      if (!permission) {
        return {
          granted: false,
          denied: false,
          blocked: false,
          unavailable: true
        }
      }

      const result = await check(permission)

      return {
        granted: result === RESULTS.GRANTED,
        denied: result === RESULTS.DENIED,
        blocked: result === RESULTS.BLOCKED,
        unavailable: result === RESULTS.UNAVAILABLE
      }
    } catch (error) {
      console.error('Erro ao verificar permissão de localização:', error)
      return { granted: false, denied: true, blocked: false }
    }
  }

export const requestLocationPermission =
  async (): Promise<LocationPermissionResponse> => {
    try {
      const permission = getLocationPermission()

      if (!permission) {
        return {
          granted: false,
          denied: true,
          blocked: false,
          unavailable: true
        }
      }

      const result = await request(permission)

      return {
        granted: result === RESULTS.GRANTED,
        denied: result === RESULTS.DENIED,
        blocked: result === RESULTS.BLOCKED,
        unavailable: result === RESULTS.UNAVAILABLE
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão de localização:', error)
      return { granted: false, denied: true, blocked: false }
    }
  }

// 🔹 NOVO: Verificar se a localização está habilitada no dispositivo
export const isLocationEnabled = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      return await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
    }

    // Para iOS, assumimos que está habilitado se a permissão foi concedida
    const status = await checkLocationPermission()
    return status.granted
  } catch (error) {
    console.error('Erro ao verificar se localização está habilitada:', error)
    return false
  }
}
