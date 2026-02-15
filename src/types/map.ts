export type Coords = { latitude: number; longitude: number }

export interface MapContextType {
  mapRef: React.RefObject<any>
  mapReady: boolean
  isLoading: boolean
  error: string | null

  centerOnUser: () => Promise<void>
  centerOnPoint: (point: Coords) => Promise<void>
  handleMapReady: () => void
  clearError: () => void
}
