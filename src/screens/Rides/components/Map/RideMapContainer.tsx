import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import MapView, { Marker, Polyline } from '../../../../components/map/MapView'
import { CustomPlace } from '@/types/places'
import { LatLngType } from '@/types/latLng'
import { RideInterface } from '@/interfaces/IRide'
import { RideStatusType } from '@/types/enum'

interface Props {
  mapRef: React.RefObject<any>
  location: {
    pickup?: CustomPlace
    dropoff?: CustomPlace
  }
  currentRide: RideInterface | null
  rideStatus: RideStatusType

  driverLocation?: LatLngType
  routeCoords?: LatLngType[]
  routeCoordsDriver?: LatLngType[]
  routeCoordsTemp?: LatLngType[]
}

export const RideMapContainer: React.FC<Props> = ({
  mapRef,
  location,
  currentRide,
  rideStatus,

  driverLocation,
  routeCoords = [],
  routeCoordsDriver = [],
  routeCoordsTemp = []
}) => {
  const markers = useMemo(() => {
    const list: Marker[] = []

    if (location.pickup) {
      list.push({
        id: 'pickup',
        coordinates: {
          latitude: location.pickup.latitude,
          longitude: location.pickup.longitude
        },
        title: location.pickup.name ?? 'Pickup',
        snippet: location.pickup.description
        // icon: require('@/assets/markers/location.plocation.ickup.png'), // TODO: Handle image icons in expo-maps
      })
    }

    if (location.dropoff) {
      list.push({
        id: 'dropoff',
        coordinates: {
          latitude: location.dropoff.latitude,
          longitude: location.dropoff.longitude
        },
        title: location.dropoff.name ?? 'Dropoff',
        snippet: location.dropoff.description
        // icon: require('@/assets/markers/dropoff.png'),
      })
    }

    if (driverLocation) {
      list.push({
        id: 'driver',
        coordinates: {
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude
        },
        title: 'Driver'
        // icon: require('@/assets/markers/moto.png'),
        // rotation: driverLocation.rotation
      })
    }

    return list
  }, [location.pickup, location.dropoff, driverLocation])

  const polylines = useMemo(() => {
    const list: Polyline[] = []

    // Stationary states: no routes, focus on markers
    const stationaryStatuses: RideStatusType[] = [
      'arrived_pickup',
      'arrived_dropoff',
      'completed',
      'canceled'
    ]

    if (stationaryStatuses.includes(rideStatus)) {
      return list
    }

    switch (rideStatus) {
      // Preview: full route pickup → dropoff (light green)
      case 'idle':
      case 'pending': {
        if (routeCoords.length > 0) {
          list.push({
            id: 'routePreview',
            coordinates: routeCoords,
            color: '#86EFAC',
            width: 4
          })
        }
        // Also show temp route if available (e.g. summary preview)
        if (routeCoordsTemp.length > 0) {
          list.push({
            id: 'routeTemp',
            coordinates: routeCoordsTemp,
            color: '#86EFAC',
            width: 4
          })
        }
        break
      }

      // Driver heading to pickup (blue)
      case 'driver_on_the_way': {
        if (routeCoordsDriver.length > 0) {
          list.push({
            id: 'routeDriverToPickup',
            coordinates: routeCoordsDriver,
            color: '#3B82F6',
            width: 5
          })
        }
        break
      }

      // Driver heading to dropoff (green)
      case 'picked_up': {
        if (routeCoordsDriver.length > 0) {
          list.push({
            id: 'routeDriverToDropoff',
            coordinates: routeCoordsDriver,
            color: '#10B981',
            width: 5
          })
        }
        break
      }
    }

    return list
  }, [routeCoords, routeCoordsDriver, routeCoordsTemp, rideStatus])

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFillObject}
      cameraPosition={{
        coordinates: {
          latitude: currentRide
            ? currentRide.pickup.latitude
            : location.pickup?.latitude,
          longitude: currentRide
            ? currentRide.pickup.longitude
            : location.pickup?.longitude
        },
        zoom: 13
      }}
      markers={markers}
      polylines={polylines}
      uiSettings={{
        myLocationButtonEnabled: false
      }}
      properties={{
        isMyLocationEnabled: false,
        isTrafficEnabled: ['driver_on_the_way', 'picked_up'].includes(
          rideStatus
        )
      }}
    />
  )
}
