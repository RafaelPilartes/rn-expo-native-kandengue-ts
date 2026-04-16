import React, { useRef, useEffect, useCallback } from 'react'
import { View } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import PlatformMapView, { Marker } from '@/components/map/MapView'
import { MapError } from '@/components/map/MapError'
import { AddressDisplay } from './components/Display/AddressDisplay'
import { MyLocationButton } from './components/Buttons/MyLocationButton'
import { RideFlowBottomSheet } from './components/Flow/RideFlowBottomSheet'

import { useMap } from '@/providers/MapProvider'
import { useLocation } from '@/context/LocationContext'
import { useRideFlowStore } from '@/storage/store/useRideFlowStore'
import { useRideRoute } from '@/hooks/ride/useRideRoute'
import { useFareCalculation } from '@/hooks/ride/useFareCalculation'
import { useRideSummary } from '@/hooks/useRideSummary'

import { HomeStackParamList } from '@/types/navigation'

export default function RideFlowScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>()
  const { centerOnUser, mapRef, handleMapReady } = useMap()
  const {
    location,
    requestCurrentLocation,
    error: locationError,
    address,
    isGettingAddress
  } = useLocation()

  const { pickup, dropoff, reset } = useRideFlowStore()

  const bottomSheetRef = useRef<BottomSheet>(null)

  // Reset flow state every time the user enters this screen
  useEffect(() => {
    reset()
  }, [])

  // Prefetch ride rates for fare calculation
  const { rideRates } = useRideSummary(undefined)

  // Calculate route when both locations are selected
  const {
    routeCoords: routeCoordsFlow,
    distanceKm,
    durationMinutes
  } = useRideRoute(pickup ?? undefined, dropoff ?? undefined)

  const { fareDetails } = useFareCalculation(distanceKm, 0, rideRates ?? null)

  const isLoadingRoute = !!(pickup && dropoff && distanceKm === 0)

  // Map setup
  const initialCamera = {
    coordinates: {
      latitude: location?.latitude ?? -8.839987,
      longitude: location?.longitude ?? 13.289437
    },
    zoom: 15
  }

  const markers: Marker[] = location
    ? [
        {
          id: 'user-loc',
          coordinates: location,
          title: 'Sua localização'
        }
      ]
    : []

  const handleRetry = useCallback(async () => {
    await requestCurrentLocation()
    await centerOnUser()
  }, [requestCurrentLocation, centerOnUser])

  if (locationError) {
    return (
      <MapError
        error={locationError}
        onRetry={handleRetry}
        onGoBack={() => navigation.goBack()}
      />
    )
  }

  return (
    <View className="flex-1 bg-white">
      {/* Floating Address Bar (Top) */}
      <View className="absolute top-safe left-0 right-0 z-10">
        <AddressDisplay
          address={address ?? 'Não foi possível obter o endereço...'}
          isLoading={isGettingAddress}
        />
      </View>

      {/* Full-Screen Map */}
      <PlatformMapView
        ref={mapRef}
        style={{ flex: 1 }}
        cameraPosition={initialCamera}
        markers={markers}
        onMapLoaded={handleMapReady}
        // Draw route polyline when both locations are set
        polylines={
          routeCoordsFlow && routeCoordsFlow.length > 0
            ? [
                {
                  id: 'flow-route',
                  coordinates: routeCoordsFlow,
                  color: '#111827',
                  width: 4
                }
              ]
            : []
        }
        uiSettings={{
          compassEnabled: true,
          myLocationButtonEnabled: false,
          zoomControlsEnabled: false
        }}
      />

      {/* My Location Button (floating, above sheet) */}
      {/* <View className="absolute bottom-[42%] right-4 z-10">
        <MyLocationButton
          onPress={centerOnUser}
          disabled={!location}
          isLocating={isGettingAddress}
        />
      </View> */}

      {/* Multi-Step Bottom Sheet */}
      <RideFlowBottomSheet
        bottomSheetRef={bottomSheetRef}
        fareDetails={fareDetails}
        distanceKm={distanceKm}
        durationMinutes={durationMinutes ?? undefined}
        isLoadingRoute={isLoadingRoute}
      />
    </View>
  )
}
