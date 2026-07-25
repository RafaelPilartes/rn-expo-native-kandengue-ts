import React, { useEffect, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import MapView, { Polyline } from '@/components/map/MapView'
import { RideStatusType } from '@/types/enum'
import { useMapMarkers } from './useMapMarkers'
import type { RouteInfo, DriverInfo } from '@/hooks/ride/useRideSummary'

type LatLng = { latitude: number; longitude: number }

interface RideMapContainerProps {
  mapRef: React.RefObject<any>
  rideStatus: RideStatusType
  pickup?: LatLng & { name?: string; description?: string }
  dropoff?: LatLng & { name?: string; description?: string }
  driver: DriverInfo
  route: RouteInfo
  driverRoute: RouteInfo
}

export const RideMapContainer: React.FC<RideMapContainerProps> = ({
  mapRef,
  rideStatus,
  pickup,
  dropoff,
  driver,
  route,
  driverRoute
}) => {
  // Markers with proper colors (hook handles platform differences)
  const markers = useMapMarkers({
    pickup,
    dropoff,
    driver: driver.location
      ? { location: driver.location, heading: driver.heading }
      : undefined,
    rideStatus
  })

  // Polylines by status
  const polylines = useMemo(() => {
    const list: Polyline[] = []

    switch (rideStatus) {
      // Preview: full route pickup → dropoff (light green)
      case 'idle':
      case 'pending': {
        if (route.coords.length > 0) {
          list.push({
            id: 'routePreview',
            coordinates: route.coords,
            color: '#86EFAC',
            width: 4
          })
        }
        break
      }

      // Driver heading to pickup: blue driver route + gray preview
      case 'driver_on_the_way': {
        if (driverRoute.coords.length > 0) {
          list.push({
            id: 'driverToPickup',
            coordinates: driverRoute.coords,
            color: '#3B82F6',
            width: 5
          })
        }
        // Show pickup→dropoff as context (gray)
        if (route.coords.length > 0) {
          list.push({
            id: 'routeContext',
            coordinates: route.coords,
            color: '#D1D5DB',
            width: 3
          })
        }
        break
      }

      // At pickup: show upcoming route pickup→dropoff (green)
      case 'arrived_pickup': {
        if (route.coords.length > 0) {
          list.push({
            id: 'nextSegment',
            coordinates: route.coords,
            color: '#86EFAC',
            width: 4
          })
        }
        break
      }

      // Delivering: driver→dropoff (green, trimmed/shrinking)
      case 'picked_up': {
        if (driverRoute.coords.length > 0) {
          list.push({
            id: 'driverToDropoff',
            coordinates: driverRoute.coords,
            color: '#10B981',
            width: 5
          })
        }
        break
      }

      // arrived_dropoff, completed, canceled: no polylines
      default:
        break
    }

    return list
  }, [route.coords, driverRoute.coords, rideStatus])

  // Camera follow driver in real-time
  useEffect(() => {
    if (!mapRef.current) return

    const isDriverMoving = ['driver_on_the_way', 'picked_up'].includes(rideStatus)

    if (isDriverMoving && driver.location) {
      mapRef.current?.setCameraPosition?.({
        coordinates: {
          latitude: driver.location.latitude,
          longitude: driver.location.longitude
        },
        zoom: 15,
        duration: 1000 // Smooth animation (Android only)
      })
    }
  }, [rideStatus, driver.location, mapRef])

  // Initial camera position
  const initialCamera = useMemo(() => ({
    coordinates: {
      latitude: pickup?.latitude ?? -8.838,
      longitude: pickup?.longitude ?? 13.234
    },
    zoom: 13
  }), [pickup?.latitude, pickup?.longitude])

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFillObject}
      cameraPosition={initialCamera}
      markers={markers}
      polylines={polylines}
      uiSettings={{
        myLocationButtonEnabled: false
      }}
      properties={{
        isMyLocationEnabled: false,
        isTrafficEnabled: ['driver_on_the_way', 'picked_up'].includes(rideStatus)
      }}
    />
  )
}
