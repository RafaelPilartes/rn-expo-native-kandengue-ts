export interface Region {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
}

export interface CameraState {
  center: {
    latitude: number
    longitude: number
  }
  pitch: number
  heading: number
  zoom: number
}

export type MapType = 'standard' | 'satellite' | 'hybrid' | 'terrain'
