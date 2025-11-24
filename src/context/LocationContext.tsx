// src/contexts/LocationContext.tsx
import React, { createContext, useState, useRef, useEffect } from 'react'
import * as Location from 'expo-location'
import { getAddressFromCoords } from '@/services/google/googleApi'
import { AddressResponse } from '@/types/geoLocation'

type Coords = { latitude: number; longitude: number }

interface LocationContextType {
  location: Coords | null
  address: string | null
  fullAddress: AddressResponse | null
  isTracking: boolean
  error: string | null
  isLoading: boolean
  isGettingAddress: boolean

  requestCurrentLocation: () => Promise<Coords | null>
  startTracking: () => void
  stopTracking: () => void
  fetchAddress: (coords?: Coords) => Promise<void>
  clearError: () => void
}

export const LocationContext = createContext<LocationContextType>(
  {} as LocationContextType
)

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<Coords | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [fullAddress, setFullAddress] = useState<AddressResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTracking, setIsTracking] = useState(false)
  const [isGettingAddress, setIsGettingAddress] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const watcher = useRef<Location.LocationSubscription | null>(null)

  /** ---- Permissões (Expo) ---- */
  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    return status === 'granted'
  }

  /** ---- Buscar endereço via Google (reverse geocoding) ---- */
  const fetchAddress = async (coords?: Coords) => {
    setIsGettingAddress(true)

    try {
      const c = coords || location
      if (!c) {
        setAddress('Sem coordenadas para obter o endereço')
        setFullAddress(null)
        return
      }

      const result = await getAddressFromCoords(c.latitude, c.longitude)

      if (typeof result === 'string') {
        setAddress(result)
        setFullAddress(null)
      } else {
        setAddress(result.addr)
        setFullAddress(result)
      }
    } catch (e) {
      console.warn('⚠️ Erro buscando endereço:', e)
      setAddress('Não foi possível obter o endereço')
      setFullAddress(null)
    } finally {
      setIsGettingAddress(false)
    }
  }

  /** ---- Pega localização só uma vez ---- */
  const requestCurrentLocation = async (): Promise<Coords | null> => {
    setIsLoading(true)
    setError(null)

    const hasPermission = await requestPermission()
    if (!hasPermission) {
      setError('Permissão de localização negada.')
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

  /** ---- Clear error ---- */
  const clearError = () => setError(null)

  /** ---- Tracking contínuo ---- */
  const startTracking = async () => {
    if (isTracking) return

    const hasPermission = await requestPermission()
    if (!hasPermission) {
      setError('Permissão negada para acessar localização.')
      return
    }

    setIsTracking(true)

    watcher.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // 5 segundos
        distanceInterval: 3
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
  }

  /** ---- Para tracking ---- */
  const stopTracking = () => {
    if (!isTracking) return

    watcher.current?.remove()
    watcher.current = null

    setIsTracking(false)
    console.log('⏹ Tracking parado')
  }

  /** Pega uma localização inicial */
  useEffect(() => {
    requestCurrentLocation()
  }, [])

  return (
    <LocationContext.Provider
      value={{
        location,
        address,
        fullAddress,
        isTracking,
        error,
        isLoading,
        isGettingAddress,

        requestCurrentLocation,
        startTracking,
        stopTracking,
        fetchAddress,
        clearError
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}
