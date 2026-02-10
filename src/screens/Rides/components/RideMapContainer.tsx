import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import PlatformMapView, {
  Marker,
  Polyline
} from '../../../components/map/MapView'
import { CustomPlace } from '@/types/places'
import { LatLngType } from '@/types/latLng'

interface Props {
  pickup?: CustomPlace
  dropoff?: CustomPlace
  driverLocation?: LatLngType
  routeCoords?: LatLngType[]
  routeCoordsDriver?: LatLngType[]
  routeCoordsTemp?: LatLngType[]
}

export const RideMapContainer: React.FC<Props> = ({
  pickup,
  dropoff,
  driverLocation,
  routeCoords = [],
  routeCoordsDriver = [],
  routeCoordsTemp = []
}) => {
  const markers = useMemo(() => {
    const list: Marker[] = []

    if (pickup) {
      list.push({
        id: 'pickup',
        coordinates: { latitude: pickup.latitude, longitude: pickup.longitude },
        title: pickup.name ?? 'Pickup',
        snippet: pickup.description
        // icon: require('@/assets/markers/pickup.png'), // TODO: Handle image icons in expo-maps
      })
    }

    if (dropoff) {
      list.push({
        id: 'dropoff',
        coordinates: {
          latitude: dropoff.latitude,
          longitude: dropoff.longitude
        },
        title: dropoff.name ?? 'Dropoff',
        snippet: dropoff.description
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
  }, [pickup, dropoff, driverLocation])

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
    <View style={styles.container}>
      <PlatformMapView
        style={styles.map}
        markers={markers}
        polylines={polylines}
        // CustomMapView logic for userLocation is not needed here as RideMapContainer is for static/driver view?
        // If we need to show user location, we pass coordinates.
        // PlatformMapView supports `showUserLocation`?
        // No, expo-maps uses `userLocation` prop which is object { coordinates, followUserLocation }.
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 16
  },
  map: {
    width: '100%',
    height: '100%'
  }
})
