import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import {
  CustomMapView,
  MapMarker,
  MapPolyline
} from '../../../components/map/MapView'
// import { useMap } from '../../../providers/MapProvider';
import { GoogleMaps } from 'expo-maps'

interface Props {
  pickup?: {
    latitude: number
    longitude: number
    title?: string
    description?: string
  }
  dropoff?: {
    latitude: number
    longitude: number
    title?: string
    description?: string
  }
  driverLocation?: { latitude: number; longitude: number; rotation?: number }
  routeCoords?: { latitude: number; longitude: number }[]
  routeCoordsDriver?: { latitude: number; longitude: number }[]
  routeCoordsTemp?: { latitude: number; longitude: number }[]
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
    const list: MapMarker[] = []

    if (pickup) {
      list.push({
        id: 'pickup',
        coordinates: { latitude: pickup.latitude, longitude: pickup.longitude },
        title: pickup.title ?? 'Pickup',
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
        title: dropoff.title ?? 'Dropoff',
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
        // rotation: driverLocation.rotation // expo-maps marker doesn't seem to have rotation?
        // GoogleMapsMarker type in types.ts does NOT show rotation.
        // But it has `anchor`.
      })
    }

    return list
  }, [pickup, dropoff, driverLocation])

  const polylines = useMemo(() => {
    const list: MapPolyline[] = []

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
        // pattern: [0] // expo-maps polyline doesn't explicitly show pattern in types?
      })
    }

    return list
  }, [routeCoords, routeCoordsDriver, routeCoordsTemp])

  return (
    <View style={styles.container}>
      <CustomMapView
        markers={markers}
        polylines={polylines}
        showUserLocation={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
