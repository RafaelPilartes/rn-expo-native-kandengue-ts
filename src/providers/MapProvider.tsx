import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode
} from 'react'
import { Region, CameraState } from '../types/map'
import { useLocation } from '../context/LocationContext'

interface MapContextData {
  mapRef: any // Ref to the map view
  centerOnUser: () => void
  setMapRef: (ref: any) => void
  camera: CameraState | null
  updateCamera: (camera: CameraState) => void
}

const MapContext = createContext<MapContextData>({} as MapContextData)

export const useMap = () => useContext(MapContext)

export const MapProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const mapRef = useRef<any>(null) // Type depends on Map library
  const { location } = useLocation()
  const [camera, setCamera] = useState<CameraState | null>(null)

  const setRef = (ref: any) => {
    mapRef.current = ref
  }

  const centerOnUser = () => {
    if (location && mapRef.current) {
      // Logic depends on the map library's API
      // For expo-maps or react-native-maps, it's usually animateToRegion or moveCamera
      const { latitude, longitude } = location.coords

      // Example for common map refs
      if (mapRef.current.animateCamera) {
        mapRef.current.animateCamera({
          center: { latitude, longitude },
          zoom: 15
        })
      } else if (mapRef.current.animateToRegion) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        })
      }
    }
  }

  const updateCamera = (newCamera: CameraState) => {
    setCamera(newCamera)
  }

  return (
    <MapContext.Provider
      value={{
        mapRef: mapRef.current,
        setMapRef: setRef,
        centerOnUser,
        camera,
        updateCamera
      }}
    >
      {children}
    </MapContext.Provider>
  )
}
