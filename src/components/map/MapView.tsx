import React from 'react'
import { StyleSheet, View, ViewProps, Platform } from 'react-native'
import { GoogleMaps } from 'expo-maps'
import { useMap } from '../../providers/MapProvider'

// Export types for usage in other components
export type MapMarker = GoogleMaps.Marker
export type MapPolyline = GoogleMaps.Polyline

interface Props extends ViewProps {
  markers?: MapMarker[]
  polylines?: MapPolyline[]
  showUserLocation?: boolean
  followUserLocation?: boolean
  initialCameraPosition?: GoogleMaps.CameraPosition
}

export const CustomMapView: React.FC<Props> = ({
  markers,
  polylines,
  showUserLocation,
  followUserLocation,
  initialCameraPosition,
  ...props
}) => {
  const { setMapRef, location } = useMap()

  const userLocationProp =
    showUserLocation && location
      ? {
          coordinates: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          },
          followUserLocation: followUserLocation ?? false
        }
      : undefined

  return (
    <View style={styles.container}>
      <GoogleMaps.View
        ref={ref => setMapRef(ref)}
        style={styles.map}
        markers={markers}
        polylines={polylines}
        userLocation={userLocationProp}
        cameraPosition={initialCameraPosition}
        uiSettings={{
          myLocationButtonEnabled: showUserLocation,
          zoomControlsEnabled: false,
          compassEnabled: true
        }}
        {...props}
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
