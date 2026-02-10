import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import MapView, { Marker, Polyline } from '../../../components/map/MapView'
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

    if (routeCoordsTemp.length > 0) {
      list.push({
        id: 'routeTemp',
        coordinates: routeCoordsTemp,
        color: '#10B981',
        width: 4
      })
    }

    if (routeCoords.length > 0) {
      list.push({
        id: 'route',
        coordinates: routeCoords,
        color: '#10B981',
        width: 4
      })
    }

    if (routeCoordsDriver.length > 0) {
      list.push({
        id: 'routeDriver',
        coordinates: routeCoordsDriver,
        color: '#007AFF',
        width: 5
      })
    }

    return list
  }, [routeCoords, routeCoordsDriver, routeCoordsTemp])

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
