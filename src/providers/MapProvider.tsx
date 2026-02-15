import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback
} from 'react'
import { Coords, MapContextType } from '@/types/map'
import { useLocation } from '@/context/LocationContext'

const MapContext = createContext<MapContextType>({} as MapContextType)

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const [mapReady, setMapReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mapRef = useRef<any>(null)

  const { requestCurrentLocation, location } = useLocation()

  // -----------------------------------------------------
  // 📌 Centralizar no usuário
  // -----------------------------------------------------
  const centerOnUser = async () => {
    const coords = location ?? (await requestCurrentLocation())
    if (!coords || !mapRef.current) return

    mapRef.current?.setCameraPosition?.({
      coordinates: coords,
      zoom: 15
    })
  }
  const centerOnPoint = async (point: Coords) => {
    if (!mapRef.current) return

    mapRef.current?.setCameraPosition?.({
      coordinates: point,
      zoom: 15
    })
  }

  // -----------------------------------------------------
  // 📌 Mapa pronto
  // -----------------------------------------------------
  const handleMapReady = useCallback(() => {
    setMapReady(true)
    if (location) {
      mapRef.current?.setCameraPosition?.({
        coordinates: location,
        zoom: 15
      })
    }
  }, [location])

  // -----------------------------------------------------
  // 📌 Limpar erro
  // -----------------------------------------------------
  const clearError = useCallback(() => setError(null), [])

  return (
    <MapContext.Provider
      value={{
        mapRef,
        mapReady,
        isLoading,
        error,
        centerOnUser,
        centerOnPoint,
        handleMapReady,
        clearError
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export const useMap = () => useContext(MapContext)
