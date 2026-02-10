// src/types/trackingTypes.ts
import * as Location from 'expo-location'

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

/**
 * Configuration for each tracking mode
 */
export interface TrackingConfig {
  mode: TrackingMode
  accuracy: Location.Accuracy
  timeInterval: number // milliseconds
  distanceInterval: number // meters
  updateTarget: 'user'
  fieldName: string
}

/**
 * Predefined tracking configurations for each mode
 */
export const TRACKING_CONFIGS: Record<TrackingMode, Partial<TrackingConfig>> = {
  OFFLINE: {
    mode: 'OFFLINE'
  },
  PASSIVE: {
    mode: 'PASSIVE',
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 60000, // 1 minute
    distanceInterval: 100, // 100 meters
    updateTarget: 'user',
    fieldName: 'location'
  },
  RIDE: {
    mode: 'RIDE',
    accuracy: Location.Accuracy.High,
    timeInterval: 5000, // 5 seconds
    distanceInterval: 5, // 5 meters
    updateTarget: 'user',
    fieldName: 'location'
  }
}

/**
 * Determine the appropriate tracking mode based on driver state
 *
 * Priority:
 * 1. If user is logged in and has an active ride -> RIDE
 * 2. If user is logged in and has no active ride -> PASSIVE
 * 3. If user is not logged in -> OFFLINE
 */
export function determineTrackingMode(
  hasUser: boolean,
  hasActiveRide: boolean
): TrackingMode {
  if (hasUser && hasActiveRide) return 'RIDE'
  if (hasUser) return 'PASSIVE'
  return 'OFFLINE'
}
