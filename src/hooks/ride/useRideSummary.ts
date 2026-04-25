// src/hooks/ride/useRideSummary.ts
import { useEffect, useMemo, useState } from 'react'
import { useWaitTimerByDate } from '../useWaitTimerByDate'
import { useRideRatesViewModel } from '@/viewModels/RideRateViewModel'
import { RideRateEntity } from '@/core/entities/RideRate'
import { useRideRealtime } from './useRideRealtime'
import { useRideRoute } from './useRideRoute'
import { useRideFlow, type CreateRideParams } from './useRideFlow'
import { useFareCalculation } from './useFareCalculation'
import { RideStatusType } from '@/types/enum'
import { useDriverRealtimeLocation } from '../driver/useDriverRealtimeLocation'
import { trimPolylineFromPosition } from '@/helpers/polyline'
import { calculateHeading } from '@/helpers/bearing'
import { CustomPlace } from '@/types/places'

type LatLng = { latitude: number; longitude: number }

export type UseRideSummaryConfig = {
  rideId?: string
  previewPickup: CustomPlace
  previewDropoff: CustomPlace
}

export type RouteInfo = {
  coords: LatLng[]
  distanceKm: number
  durationMinutes: number
  distanceText: string
  durationText: string
}

export type DriverInfo = {
  location: LatLng | null
  heading: number
}

export type WaitTimerInfo = {
  formatted: string
  extraMinutes: number
  totalMinutes: number
  elapsedSeconds: number
}

export function useRideSummary(config: UseRideSummaryConfig) {
  const { rideId, previewPickup, previewDropoff } = config

  // Core state
  const [loading, setLoading] = useState(true)
  const [rideStatus, setRideStatus] = useState<RideStatusType>('idle')
  const [rideRates, setRideRates] = useState<RideRateEntity | null>(null)

  // Ride data (realtime from Firestore)
  const { ride, rideTracking, isLoadingRide, isLoadingTracking } = useRideRealtime(rideId)

  // Rates
  const { listenAll: listenRates } = useRideRatesViewModel()

  // Determine route endpoints:
  // If ride exists, use ride data. Otherwise use preview params.
  const routeOrigin = useMemo<LatLng | null>(
    () => ride?.pickup ?? previewPickup,
    [ride?.pickup, previewPickup]
  )
  const routeDestination = useMemo<LatLng | null>(
    () => ride?.dropoff ?? previewDropoff,
    [ride?.dropoff, previewDropoff]
  )

  // ONE route calculation: pickup → dropoff (no duplication!)
  const {
    routeCoords,
    distanceKm,
    durationMinutes,
    distance: distanceText,
    duration: durationText
  } = useRideRoute(routeOrigin, routeDestination)

  // Driver location (realtime)
  const { location: driverLocation, heading: driverHeading } =
    useDriverRealtimeLocation(ride?.driver?.id)

  const stableDriverPosition = useMemo<LatLng | null>(() => {
    if (driverLocation?.latitude && driverLocation?.longitude) {
      return {
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude
      }
    }

    // Fallback to ride tracking path if driver document doesn't have location
    if (rideTracking?.path && rideTracking.path.length > 0) {
      const lastPos = rideTracking.path[rideTracking.path.length - 1]
      return {
        latitude: lastPos.latitude,
        longitude: lastPos.longitude
      }
    }

    return null
  }, [driverLocation?.latitude, driverLocation?.longitude, rideTracking?.path])

  const stableDriverHeading = useMemo(() => {
    if (driverLocation) return driverHeading

    // Fallback to ride tracking path
    if (rideTracking?.path && rideTracking.path.length >= 2) {
      const lastPos = rideTracking.path[rideTracking.path.length - 1]
      const prevPos = rideTracking.path[rideTracking.path.length - 2]
      return calculateHeading(
        prevPos.latitude,
        prevPos.longitude,
        lastPos.latitude,
        lastPos.longitude
      )
    }

    return 0
  }, [driverLocation, driverHeading, rideTracking?.path])

  // Driver's current destination depends on ride status
  const driverCurrentDestination = useMemo<LatLng | null>(() => {
    if (!ride) return null
    switch (ride.status) {
      case 'driver_on_the_way':
        return ride.pickup // Going to pickup
      case 'picked_up':
        return ride.dropoff // Going to dropoff
      default:
        return null // No route needed (arrived, completed, etc.)
    }
  }, [ride?.status, ride?.pickup, ride?.dropoff])

  // Driver route: driver position → current destination (throttled)
  const {
    routeCoords: rawDriverRouteCoords,
    distanceKm: driverDistanceKm,
    durationMinutes: driverDurationMinutes,
    distance: driverDistanceText,
    duration: driverDurationText
  } = useRideRoute(stableDriverPosition, driverCurrentDestination)

  // Trim driver polyline (Uber-style shrinking)
  const driverRouteCoords = useMemo(() => {
    if (!stableDriverPosition || rawDriverRouteCoords.length === 0) return []
    return trimPolylineFromPosition(rawDriverRouteCoords, stableDriverPosition)
  }, [rawDriverRouteCoords, stableDriverPosition])

  // Wait timer
  const waitTimer = useWaitTimerByDate({
    isWaiting: rideStatus === 'arrived_pickup',
    startDate: ride?.waiting_start_at,
    endDate: ride?.waiting_end_at,
    freeMinutes: rideRates?.day_rates?.wait_time_free_minutes
  })

  // Fare calculation (unified — one source of truth)
  const { fareDetails, handleCalculateFareSummary } = useFareCalculation(
    distanceKm,
    waitTimer.totalMinutes ?? 0,
    rideRates ?? null
  )

  // Ride flow actions
  const {
    create: handleCreateRide,
    canceled: handleCanceledRide,
    completed: handleCompletedRide,
    ...restActions
  } = useRideFlow(rideId, fareDetails, rideRates)

  // Sync ride status from realtime data
  useEffect(() => {
    if (ride?.status) {
      setRideStatus(ride.status)
    }
  }, [ride?.status])

  // Load rates (once)
  useEffect(() => {
    const unsubscribe = listenRates((rates: RideRateEntity[]) => {
      if (rates?.[0]) setRideRates(rates[0])
    })
    return unsubscribe
  }, [])

  // Loading state management
  useEffect(() => {
    if (!rideId) {
      // Preview mode: loaded when we have route coords or fare
      const hasPreviewData = routeCoords.length > 0 || fareDetails
      setLoading(!hasPreviewData)
      return
    }

    // Tracking mode: loaded when ride data is available
    if (!isLoadingRide && ride) {
      setLoading(false)
    }
  }, [rideId, routeCoords, fareDetails, isLoadingRide, ride])

  // Assemble clean return objects
  const route: RouteInfo = useMemo(
    () => ({
      coords: routeCoords,
      distanceKm,
      durationMinutes,
      distanceText,
      durationText
    }),
    [routeCoords, distanceKm, durationMinutes, distanceText, durationText]
  )

  const driverRoute: RouteInfo = useMemo(
    () => ({
      coords: driverRouteCoords,
      distanceKm: driverDistanceKm,
      durationMinutes: driverDurationMinutes,
      distanceText: driverDistanceText,
      durationText: driverDurationText
    }),
    [driverRouteCoords, driverDistanceKm, driverDurationMinutes, driverDistanceText, driverDurationText]
  )

  const driver: DriverInfo = useMemo(
    () => ({
      location: stableDriverPosition,
      heading: stableDriverHeading
    }),
    [stableDriverPosition, stableDriverHeading]
  )

  return {
    // State
    loading,
    rideStatus,
    currentRide: ride,
    rideRates,

    // Routes
    route,
    driverRoute,

    // Driver
    driver,

    // Fare
    fareDetails,

    // Wait timer
    waitTimer,

    // Actions
    actions: {
      createRide: handleCreateRide,
      cancelRide: handleCanceledRide,
      completeRide: handleCompletedRide,
      calculateFareSummary: handleCalculateFareSummary
    }
  }
}
