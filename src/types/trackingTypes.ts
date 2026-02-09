export type TrackingMode = 'PASSIVE' | 'RIDE' | 'OFFLINE'
// *Passenger App Logic:*
// - 'PASSIVE': Determine current city/region (low frequency).
// - 'RIDE': High frequency tracking during an active ride (safety/sharing).
// - 'OFFLINE': No tracking (logged out or not needed).

export interface LocationUpdate {
  coords: {
    latitude: number
    longitude: number
    altitude: number | null
    accuracy: number | null
    altitudeAccuracy: number | null
    heading: number | null
    speed: number | null
  }
  timestamp: number
}
