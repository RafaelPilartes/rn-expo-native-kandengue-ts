// src/contexts/MapContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback
} from 'react'
import { AppState } from 'react-native'
import MapView from 'react-native-maps'
import * as Location from 'expo-location'

import { getAddressFromCoords } from '@/services/google/googleApi'
import { Coords, MapContextType } from '@/types/map'

const MapContext = createContext<MapContextType>({} as MapContextType)

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const [mapReady, setMapReady] = useState(false)
  const [location, setLocation] = useState<Coords | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isGettingAddress, setIsGettingAddress] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mapRef = useRef<MapView | null>(null)
  const watchRef = useRef<Location.LocationSubscription | null>(null)
  const appStateRef = useRef(AppState.currentState)

  /** ---- Permissões com Expo ---- */
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    const granted = status === 'granted'
    setHasPermission(granted)
    return granted
  }

  /** ---- Reverse geocoding (via Google) ---- */
  const fetchAddress = async (coords: Coords) => {
    setIsGettingAddress(true)
    try {
      const addr = await getAddressFromCoords(coords.latitude, coords.longitude)
      setAddress(typeof addr === 'string' ? addr : addr.addr)
    } catch (err) {
      console.warn('Erro no reverse geocode:', err)
    } finally {
      setIsGettingAddress(false)
    }
  }

  /** ---- Localização atual ---- */
  const getCurrentLocation = async (): Promise<Coords | null> => {
    setIsLoading(true)
    setError(null)

    const perm = await requestLocationPermission()
    if (!perm) {
      setError('Permissão negada')
      setIsLoading(false)
      return null
    }

    try {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      })

      const coords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      }

      setLocation(coords)
      fetchAddress(coords)

      return coords
    } catch (err: any) {
      console.warn('Erro getCurrentLocation:', err)
      setError(err?.message || 'Erro ao obter localização')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  /** ---- Centralizar no usuário ---- */
  const centerOnUser = async () => {
    const coords = location ?? (await getCurrentLocation())
    if (!coords || !mapRef.current) return

    mapRef.current.animateToRegion(
      {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      },
      800
    )
  }

  /** ---- Tracking contínuo ---- */
  const startTracking = async () => {
    const perm = await requestLocationPermission()
    if (!perm) {
      setError('Permissão negada')
      return
    }

    if (watchRef.current) {
      watchRef.current.remove()
    }

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 5
      },
      pos => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }
        setLocation(coords)
        fetchAddress(coords)
      }
    )

    setIsTracking(true)
  }

  /** ---- Parar tracking ---- */
  const stopTracking = useCallback(() => {
    if (watchRef.current) {
      watchRef.current.remove()
      watchRef.current = null
    }
    setIsTracking(false)
  }, [])

  /** ---- Mapa pronto ---- */
  const handleMapReady = useCallback(() => {
    setMapReady(true)

    if (location) {
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        },
        800
      )
    }
  }, [location])

  const clearError = useCallback(() => setError(null), [])

  /** ---- Buscar localização inicial e iniciar tracking ---- */
  useEffect(() => {
    getCurrentLocation()
    startTracking()

    return () => stopTracking()
  }, [])

  /** ---- Controlar tracking ao mudar estado do app ---- */
  useEffect(() => {
    const sub = AppState.addEventListener('change', next => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        next === 'active'
      ) {
        if (isTracking) startTracking()
      } else if (next.match(/inactive|background/)) {
        stopTracking()
      }
      appStateRef.current = next
    })

    return () => {
      sub.remove()
      stopTracking()
    }
  }, [isTracking])

  return (
    <MapContext.Provider
      value={{
        mapRef,
        mapReady,
        location,
        address,
        isLoading,
        isTracking,
        hasPermission,
        error,
        isGettingAddress,
        getCurrentLocation,
        centerOnUser,
        startTracking,
        stopTracking,
        handleMapReady,
        clearError
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export const useMap = () => useContext(MapContext)
