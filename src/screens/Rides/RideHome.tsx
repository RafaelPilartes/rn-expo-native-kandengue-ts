import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import PlatformMapView, { Marker } from '@/components/map/MapView'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ROUTES from '@/constants/routes'
import { Package } from 'lucide-react-native'
import { BackButton } from '@/components/ui/button/BackButton'
import { MapError } from '@/components/map/MapError'
import { useMap } from '@/providers/MapProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AddressDisplay } from './components/Display/AddressDisplay'
import { MyLocationButton } from './components/Buttons/MyLocationButton'

export default function RideHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()

  const handleGoBack = () => navigation.goBack()

  // Use MapProvider context
  const {
    location,
    isLoading,
    getCurrentLocation,
    centerOnUser,
    error: locationError,
    address,
    isGettingAddress,
    mapRef,
    handleMapReady
  } = useMap()

  // Initial camera position centered on Luanda if no location
  const initialCamera = {
    coordinates: {
      latitude: location?.latitude ?? -8.839987,
      longitude: location?.longitude ?? 13.289437
    },
    zoom: 15
  }

  // Retry handler
  const handleRetry = async () => {
    await getCurrentLocation()
    await centerOnUser()
  }

  if (locationError) {
    console.log('🚨 Erro ao carregar mapa:', locationError)
    return (
      <MapError
        error={locationError}
        onRetry={handleRetry}
        onGoBack={handleGoBack}
      />
    )
  }

  // Markers array for expo-maps
  const markers: Marker[] = location
    ? [
        {
          id: 'user-loc',
          coordinates: location,
          title: 'Sua localização'
          // pinColor not directly supported on expo-maps Marker?
          // It has `icon` (image) or `color` (hue on Android).
          // Check types? GoogleMapsMarker has icon.
        }
      ]
    : []

  // UI principal
  return (
    <SafeAreaView className="flex-1 bg-white p-safe">
      {/* Top bar */}
      <View className="absolute top-safe left-0 right-0 z-10">
        <AddressDisplay
          address={address ?? 'Não foi possivel obter o endereço...'}
          isLoading={isGettingAddress}
        />
      </View>

      {/* MAP */}
      <PlatformMapView
        ref={mapRef}
        style={{ flex: 1 }}
        cameraPosition={initialCamera}
        markers={markers}
        onMapLoaded={handleMapReady}
        uiSettings={{
          compassEnabled: true,
          myLocationButtonEnabled: false,
          zoomControlsEnabled: false
        }}
        // userLocation={{ coordinates: location!, followUserLocation: false }} // If we want to show blue dot
      />

      {/* Bottom input-like box */}
      <View className="absolute bottom-safe left-0 right-0">
        <View className="flex-row items-center justify-between m-4">
          <View className="flex-row items-center">
            <BackButton className="bg-white mr-3" iconColor="black" />
          </View>

          <MyLocationButton
            onPress={centerOnUser}
            disabled={!location}
            isLocating={isLoading}
          />
        </View>

        <View className="bg-white p-6 rounded-t-3xl shadow-lg">
          <Text className="text-lg font-bold mb-3">
            Onde levaremos a sua encomenda?
          </Text>
          <TouchableOpacity
            // disabled={!location}
            onPress={() => navigation.navigate(ROUTES.Rides.CHOOSE)}
            className="flex-row items-center bg-gray-100 rounded-xl px-4 py-4"
          >
            <Package size={22} color="gray" />
            <Text className="ml-3 text-gray-500">Procure um destino</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
