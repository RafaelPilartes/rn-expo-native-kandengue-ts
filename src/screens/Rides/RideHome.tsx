import React, { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ROUTES from '@/constants/routes'
import { Package } from 'lucide-react-native'
import { BackButton } from '@/components/ui/button/BackButton'
import { AddressDisplay } from './components/AddressDisplay'
import { MyLocationButton } from './components/MyLocationButton'
import { MapError } from '@/components/map/MapError'
import { useLocation } from '@/hooks/useLocation'
import { useAppProvider } from '@/providers/AppProvider'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function RideHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()

  const { handleGoBack } = useAppProvider()

  const {
    location,
    isLoading,
    requestCurrentLocation,
    error: locationError,
    address,
    isGettingAddress
  } = useLocation()
  const mapRef = useRef<MapView | null>(null)

  const centerOnUser = async () => {
    const coords = location ?? (await requestCurrentLocation())
    if (!coords) {
      Alert.alert('Erro', 'Não foi possível obter localização.')
      return
    }

    mapRef.current?.animateToRegion(
      {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      },
      800
    )
  }

  useEffect(() => {
    if (location) {
      centerOnUser()
    }
  }, [location])

  if (locationError) {
    console.log('🚨 Erro ao carregar mapa:', locationError)
    return (
      <MapError
        error={locationError}
        onRetry={centerOnUser}
        onGoBack={handleGoBack}
      />
    )
  }

  // UI principal
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top bar */}
      <View className="absolute top-0 left-0 right-0 z-10">
        <AddressDisplay
          address={address ?? 'Não foi possivel obter o endereço...'}
          isLoading={isGettingAddress}
        />
      </View>

      {/* MAP */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location?.latitude ?? -8.839987,
          longitude: location?.longitude ?? 13.289437,
          latitudeDelta: 0.08,
          longitudeDelta: 0.01
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={true}
        zoomControlEnabled={true}
      >
        {location && (
          <Marker
            coordinate={location}
            title="Sua localização"
            pinColor="#EF4444"
          />
        )}
      </MapView>

      {/* Bottom input-like box */}
      <View className="absolute bottom-0 left-0 right-0">
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
            disabled={!location}
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
