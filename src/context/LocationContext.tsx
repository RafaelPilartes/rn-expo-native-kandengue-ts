import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef
} from 'react'
import * as Location from 'expo-location'
import { Linking } from 'react-native'
import {
  TrackingMode,
  TRACKING_CONFIGS,
  determineTrackingMode
} from '../types/trackingTypes'
import { BACKGROUND_LOCATION_TASK } from '../services/location/BackgroundLocationTask'
import { LatLngType } from '@/types/latLng'
import { useAuthStore } from '@/storage/store/useAuthStore'
import { useUsersViewModel } from '@/viewModels/UserViewModel'
import { useAlert } from './AlertContext'
import { getAddressFromCoords } from '@/services/google/googleApi'
import { useUserRides } from './UserRidesContext'
import LocationDisclosureModal from '@/components/modals/LocationDisclosureModal'

interface LocationContextData {
  location: LatLngType | null
  address: string | null
  isTracking: boolean
  trackingMode: TrackingMode
  error: string | null
  isLoading: boolean
  isGettingAddress: boolean
  missingPermission: boolean
  isCheckingPermissions: boolean

  requestCurrentLocation: () => Promise<LatLngType | null>
  startTracking: (mode: TrackingMode) => Promise<void>
  stopTracking: () => Promise<void>
  fetchAddress: (coords?: LatLngType) => Promise<void>
  clearError: () => void
  getCurrentTrackingMode: () => TrackingMode
  triggerPermissionFlow: () => void
  requestPermission: () => Promise<boolean>
}

export const LocationContext = createContext<LocationContextData>(
  {} as LocationContextData
)

export const useLocation = () => useContext(LocationContext)

export const LocationProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [location, setLocation] = useState<LatLngType | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [isTracking, setIsTracking] = useState<boolean>(false)
  const [trackingMode, setTrackingMode] = useState<TrackingMode>('PASSIVE')
  const [isGettingAddress, setIsGettingAddress] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Explicit Disclosure State
  const [showDisclosure, setShowDisclosure] = useState(false)
  const [missingPermission, setMissingPermission] = useState(false)

  const watchRef = useRef<Location.LocationSubscription | null>(null)

  const { showAlert } = useAlert()

  const { user } = useAuthStore()
  const { updateUser } = useUsersViewModel()
  const { activeRides } = useUserRides()

  // --------------------------------------------------------
  // 1) Permission Request Logic
  // --------------------------------------------------------
  const checkInitialPermissions = async () => {
    console.log('🔹 [LocationContext] Checking initial permissions...')
    try {
      const { status } = await Location.getForegroundPermissionsAsync()
      console.log(`🔹 [LocationContext] Initial status: ${status}`)

      // Update missingPermission based on current status
      const isMissing = status !== 'granted'
      setMissingPermission(isMissing)

      if (!isMissing) {
        console.log(
          '✅ [LocationContext] Permission granted, requesting location...'
        )
        // Force initial fetch
        requestCurrentLocation()
      }
    } catch (error) {
      console.warn(
        '❌ [LocationContext] Error checking initial location permissions:',
        error
      )
      // On error, assume permission is missing to be safe
      setMissingPermission(true)
    } finally {
      setIsCheckingPermissions(false)
    }
  }

  useEffect(() => {
    if (user) {
      checkInitialPermissions()
    }
  }, [user])

  // Public method to start the flow
  const triggerPermissionFlow = () => {
    setShowDisclosure(true)
  }

  const handleAcceptDisclosure = async () => {
    setShowDisclosure(false)
    // Wait for modal to close (iOS fix)
    setTimeout(async () => {
      await requestInternalPermission()
    }, 500)
  }

  const handleDeclineDisclosure = () => {
    setShowDisclosure(false)
    // User explicitly declined disclosure
    setMissingPermission(true)
  }

  const requestInternalPermission = async (): Promise<boolean> => {
    console.log('🛡️ [LocationContext] Requesting internal permission...')
    try {
      // 1. Check current status first
      const { status: existingStatus, canAskAgain } =
        await Location.getForegroundPermissionsAsync()

      console.log(
        `🛡️ [LocationContext] Existing status: ${existingStatus}, canAskAgain: ${canAskAgain}`
      )

      // 2. If already granted, we are good
      if (existingStatus === 'granted') {
        setMissingPermission(false)
        return true
      }

      // 3. If denied and cannot ask again (blocked), open settings
      if (existingStatus === 'denied' && !canAskAgain) {
        console.warn('⚠️ [LocationContext] Permission denied and blocked')
        showAlert(
          'Permissão Negada',
          'A permissão de localização foi negada permanentemente. Por favor, ative nas configurações do app.',
          'error',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Abrir Configurações',
              onPress: () => Linking.openSettings()
            }
          ]
        )
        setMissingPermission(true)
        return false
      }

      // 4. Request Permission
      console.log('🛡️ [LocationContext] Requesting foreground permission...')
      const { status: newStatus } =
        await Location.requestForegroundPermissionsAsync()

      console.log(`🛡️ [LocationContext] New status: ${newStatus}`)

      if (newStatus !== 'granted') {
        setError('Permissão de localização necessária.')
        setMissingPermission(true)
        return false
      }

      setMissingPermission(false)

      // 5. Check background permission (optional, separate flow usually)
      // const { status: bgStatus } =
      //   await Location.requestBackgroundPermissionsAsync()
      // if (bgStatus !== 'granted') {
      //   console.warn('Background permission denied')
      // }

      return true
    } catch (e) {
      console.error('❌ [LocationContext] Error requesting permission:', e)
      setError('Erro ao solicitar permissão.')
      return false
    }
  }

  // --------------------------------------------------------
  // 2) Reverse Geocoding
  // --------------------------------------------------------
  const fetchAddress = async (coords?: LatLngType) => {
    setIsGettingAddress(true)

    try {
      const useCoords = coords ?? location
      if (!useCoords) {
        setAddress('Sem coordenadas para obter endereço')
        return
      }

      // Promise<AddressResponse | string>
      const result = await getAddressFromCoords(
        useCoords.latitude,
        useCoords.longitude
      )

      if (typeof result === 'string') {
        setAddress(result)
      } else {
        setAddress(result.addr || 'Não foi possível obter o endereço')
      }
    } catch (e) {
      console.warn('⚠️ Erro buscando endereço:', e)
      setAddress('Não foi possível obter o endereço')
    } finally {
      setIsGettingAddress(false)
    }
  }

  // --------------------------------------------------------
  // 3) Get Current Location (one-time)
  // --------------------------------------------------------
  const requestCurrentLocation = async (): Promise<LatLngType | null> => {
    console.log('📍 [LocationContext] requestCurrentLocation called')
    setIsLoading(true)
    setError(null)

    const ok = await requestInternalPermission()
    if (!ok) {
      console.warn('⚠️ [LocationContext] Permission not granted')
      setIsLoading(false)
      return null
    }

    try {
      console.log('📍 [LocationContext] Asking Expo for current position...')
      // Add a simple timeout mechanism using Promise.race
      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      })

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout getting location')), 10000)
      )

      const pos = (await Promise.race([
        locationPromise,
        timeoutPromise
      ])) as Location.LocationObject

      console.log(
        '✅ [LocationContext] Position obtained:',
        pos.coords.latitude,
        pos.coords.longitude
      )

      const coords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      }

      setLocation(coords)
      fetchAddress(coords)
      return coords
    } catch (e: any) {
      console.error('❌ [LocationContext] Error getCurrentLocation:', e)
      setError(e?.message || 'Erro ao capturar localização.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // --------------------------------------------------------
  // 4) Update User Location in Firestore
  // --------------------------------------------------------
  const updateUserLocation = async (coords: LatLngType) => {
    if (!user?.id) return

    try {
      await updateUser.mutateAsync({
        id: user.id,
        user: {
          current_location: {
            latitude: coords.latitude,
            longitude: coords.longitude,
            updated_at: new Date()
          }
        }
      })
    } catch (error) {
      console.error('❌ Erro ao atualizar localização do motorista:', error)
    }
  }

  // --------------------------------------------------------
  // 5) Start Periodic Snapshot (Passive Mode)
  // --------------------------------------------------------
  const startPeriodicSnapshot = async () => {
    const config = TRACKING_CONFIGS.PASSIVE

    if (!config.accuracy || !config.timeInterval || !config.distanceInterval) {
      console.error('❌ Configuração de PASSIVE inválida')
      return
    }

    console.log('📍 Iniciando rastreamento PASSIVE (30s snapshots)')

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: config.accuracy,
        timeInterval: config.timeInterval,
        distanceInterval: config.distanceInterval
      },
      async pos => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }

        setLocation(coords)

        // Update driver location in Firestore
        await updateUserLocation(coords)
      }
    )
  }

  // --------------------------------------------------------
  // 6) Start Precise Tracking (Ride Mode)
  // --------------------------------------------------------
  const startPreciseTracking = async () => {
    const config = TRACKING_CONFIGS.RIDE

    if (!config.accuracy || !config.timeInterval || !config.distanceInterval) {
      console.error('❌ Configuração de RIDE inválida')
      return
    }

    console.log('🚗 Iniciando rastreamento RIDE (5s precision)')

    // A) Foreground Watch
    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: config.accuracy,
        timeInterval: config.timeInterval,
        distanceInterval: config.distanceInterval
      },
      async pos => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }
        setLocation(coords)
        fetchAddress(coords)
      }
    )

    // B) Background Updates (for ride tracking)
    try {
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(
        BACKGROUND_LOCATION_TASK
      )
      if (!hasStarted) {
        await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
          accuracy: config.accuracy,
          timeInterval: config.timeInterval,
          distanceInterval: config.distanceInterval,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: 'Kandengue Pro',
            notificationBody: 'Rastreando sua corrida em segundo plano...'
          }
        })
      }
    } catch (e) {
      console.warn('Erro ao iniciar background location updates:', e)
    }
  }

  // --------------------------------------------------------
  // 7) Start Tracking (Mode-aware)
  // --------------------------------------------------------
  const startTracking = async (mode: TrackingMode) => {
    console.log(`🎬 [startTracking] Called with mode: ${mode}`)
    console.log(
      `📊 [startTracking] Current state: tracking=${isTracking}, mode=${trackingMode}`
    )

    if (isTracking && trackingMode === mode) {
      console.log(`📍 Já rastreando no modo ${mode}`)
      return
    }

    // Stop existing tracking first
    if (isTracking) {
      console.log(
        `🛑 [startTracking] Stopping existing ${trackingMode} tracking...`
      )
      await stopTracking()
    }

    setError(null)

    const ok = await requestInternalPermission()
    if (!ok) {
      console.log('❌ [startTracking] Permission denied')
      return
    }

    // Set mode BEFORE starting async operations
    console.log(`🎯 [startTracking] Setting tracking mode to: ${mode}`)
    setTrackingMode(mode)
    setIsTracking(true)

    // Handle different modes
    if (mode === 'PASSIVE') {
      console.log('📡 [startTracking] Starting PASSIVE mode...')
      await startPeriodicSnapshot()
    } else if (mode === 'RIDE') {
      console.log('🚗 [startTracking] Starting RIDE mode...')
      await startPreciseTracking()
    } else {
      // OFFLINE or INVISIBLE - no tracking
      console.log(`🔕 Modo ${mode} - sem rastreamento`)
      setIsTracking(false)
      setTrackingMode(mode)
    }

    console.log(
      `✅ [startTracking] Completed. Mode: ${mode}, Tracking: ${mode === 'PASSIVE' || mode === 'RIDE'}`
    )
  }

  // --------------------------------------------------------
  // 8) Stop Tracking
  // --------------------------------------------------------
  const stopTracking = async () => {
    console.log('🛑 Parando rastreamento')

    // Stop Foreground Watch
    if (watchRef.current) {
      watchRef.current.remove()
      watchRef.current = null
    }

    // Stop Background Updates
    try {
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(
        BACKGROUND_LOCATION_TASK
      )
      if (hasStarted) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK)
      }
    } catch (e) {
      console.warn('Erro ao parar background location updates:', e)
    }

    setIsTracking(false)
    setTrackingMode('OFFLINE')
  }

  // --------------------------------------------------------
  // 9) Get Current Tracking Mode (helper)
  // --------------------------------------------------------
  const getCurrentTrackingMode = (): TrackingMode => {
    return trackingMode
  }

  // --------------------------------------------------------
  // 10) Clear Error
  // --------------------------------------------------------
  const clearError = () => setError(null)

  useEffect(() => {
    console.log('🔄 [LocationContext] useEffect triggered', {
      hasUser: !!user,
      user: user,
      userId: user?.id,
      hasActiveRides: activeRides.length > 0,
      currentTrackingMode: trackingMode,
      isCurrentlyTracking: isTracking
    })

    if (!user) {
      console.log('⚠️ [LocationContext] No user, stopping tracking')
      if (isTracking) stopTracking()
      return
    }

    const hasUser = !!user
    const hasActiveRides = activeRides.length > 0
    const mode = determineTrackingMode(hasUser, hasActiveRides)

    console.log(`🎯 [LocationContext] Mode determined: ${mode}`)
    console.log(
      `📊 [LocationContext] Current state: tracking=${isTracking}, mode=${trackingMode}`
    )

    if (mode === 'RIDE' || mode === 'PASSIVE') {
      console.log(`✅ [LocationContext] Starting ${mode} tracking...`)
      startTracking(mode)
    } else {
      // OFFLINE
      console.log(
        `🛑 [LocationContext] Mode is ${mode}, checking if need to stop...`
      )
      if (isTracking) {
        console.log('🛑 [LocationContext] Stopping tracking')
        stopTracking()
      } else {
        console.log(
          'ℹ️ [LocationContext] Already not tracking, no action needed'
        )
      }
    }
  }, [activeRides.length])

  return (
    <LocationContext.Provider
      value={{
        location,
        address,
        isTracking,
        trackingMode,
        error,
        isLoading,
        isGettingAddress,

        requestCurrentLocation,
        requestPermission: requestInternalPermission,
        triggerPermissionFlow,
        missingPermission,
        isCheckingPermissions,
        startTracking,
        stopTracking,
        fetchAddress,
        clearError,
        getCurrentTrackingMode
      }}
    >
      {children}
      <LocationDisclosureModal
        visible={showDisclosure}
        onAccept={handleAcceptDisclosure}
        onDecline={handleDeclineDisclosure}
      />
    </LocationContext.Provider>
  )
}
