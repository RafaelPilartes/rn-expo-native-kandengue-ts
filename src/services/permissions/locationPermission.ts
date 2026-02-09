import * as Location from 'expo-location'
import { Alert, Linking } from 'react-native'

export const checkLocationPermission =
  async (): Promise<Location.PermissionStatus> => {
    const { status } = await Location.getForegroundPermissionsAsync()
    return status
  }

export const checkBackgroundLocationPermission =
  async (): Promise<Location.PermissionStatus> => {
    const { status } = await Location.getBackgroundPermissionsAsync()
    return status
  }

export const requestForegroundPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync()
  return status === 'granted'
}

export const requestBackgroundPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestBackgroundPermissionsAsync()
  return status === 'granted'
}

export const openSettings = () => {
  Linking.openSettings()
}
