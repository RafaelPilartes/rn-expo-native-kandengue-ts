export type Coords = { latitude: number; longitude: number }

export interface MapContextType {
  mapRef: React.RefObject<any>
  mapReady: boolean
  location: Coords | null
  address: string | null
  isLoading: boolean
  isTracking: boolean
  hasPermission: boolean
  error: string | null
  isGettingAddress: boolean

  getCurrentLocation: () => Promise<Coords | null>
  centerOnUser: () => Promise<void>
  startTracking: () => void
  stopTracking: () => void
  handleMapReady: () => void
  clearError: () => void
}
