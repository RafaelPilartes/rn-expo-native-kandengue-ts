import { Platform } from 'react-native'
import { AppleMaps, GoogleMaps } from 'expo-maps'

// Platform-specific MapView
const PlatformMapView = Platform.OS === 'ios' ? AppleMaps.View : GoogleMaps.View

// Export types for convenience
export type MapViewProps = Platform['OS'] extends 'ios'
  ? AppleMaps.MapProps
  : GoogleMaps.MapProps

export type Marker = Platform['OS'] extends 'ios'
  ? AppleMaps.Marker
  : GoogleMaps.Marker

export type Polyline = Platform['OS'] extends 'ios'
  ? NonNullable<AppleMaps.MapProps['polylines']>[number]
  : NonNullable<GoogleMaps.MapProps['polylines']>[number]

export default PlatformMapView
