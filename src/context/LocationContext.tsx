import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'
import * as Location from 'expo-location'
import { Alert, AppState, AppStateStatus } from 'react-native'
import {
  checkLocationPermission,
  requestForegroundPermission,
  requestBackgroundPermission
} from '../services/permissions/locationPermission'
import { TrackingMode, LocationUpdate } from '../types/trackingTypes'
import * as TaskManager from 'expo-task-manager'
import { LOCATION_TASK_NAME } from '../services/location/BackgroundLocationTask'

interface LocationContextData {
  location: Location.LocationObject | null
  errorMsg: string | null
  mode: TrackingMode
  startTracking: (mode: TrackingMode) => Promise<void>
  stopTracking: () => Promise<void>
  permissionStatus: Location.PermissionStatus | null
  triggerPermissionFlow: () => Promise<boolean>
}

const LocationContext = createContext<LocationContextData>(
  {} as LocationContextData
)

export const useLocation = () => useContext(LocationContext)

export const LocationProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [mode, setMode] = useState<TrackingMode>('PASSIVE')
  const [permissionStatus, setPermissionStatus] =
    useState<Location.PermissionStatus | null>(null)

  useEffect(() => {
    checkPermissions()
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    )
    return () => {
      subscription.remove()
    }
  }, [])

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      checkPermissions()
    }
  }

  const checkPermissions = async () => {
    const status = await checkLocationPermission()
    setPermissionStatus(status)
  }

  const triggerPermissionFlow = async (): Promise<boolean> => {
    // This function can be called from UI to show explanation modal first
    // Then request permissions
    const foreground = await requestForegroundPermission()
    if (!foreground) return false

    // Background permission request (optional based on requirement)
    // const background = await requestBackgroundPermission();
    return true
  }

  const startTracking = async (newMode: TrackingMode) => {
    setMode(newMode)

    try {
      const { status } = await Location.getForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }

      if (newMode === 'RIDE') {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // Update every 10 meters
          deferredUpdatesInterval: 5000,
          foregroundService: {
            notificationTitle: "You're on a ride",
            notificationBody: 'Tracking your ride for safety.'
          }
        })
      } else if (newMode === 'PASSIVE') {
        // Stop high accuracy tracking, maybe do single update
        const isTaskRegistered =
          await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)
        if (isTaskRegistered) {
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
        }

        // Get current location once
        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        })
        setLocation(current)
      } else {
        // OFFLINE
        stopTracking()
      }
    } catch (err) {
      console.error('Error starting tracking:', err)
    }
  }

  const stopTracking = async () => {
    try {
      const isTaskRegistered =
        await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)
      if (isTaskRegistered) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
      }
    } catch (err) {
      console.error('Error stopping tracking:', err)
    }
  }

  return (
    <LocationContext.Provider
      value={{
        location,
        errorMsg,
        mode,
        startTracking,
        stopTracking,
        permissionStatus,
        triggerPermissionFlow
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}
