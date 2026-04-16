import React, { useRef, useEffect, useCallback, useState } from 'react'
import { View } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import PlatformMapView, { Marker } from '@/components/map/MapView'
import { MapError } from '@/components/map/MapError'
import { AddressDisplay } from './components/Display/AddressDisplay'
import { RideFlowBottomSheet } from './components/Flow/RideFlowBottomSheet'
import { MapPinOverlay } from './components/Map/MapPinOverlay'
import { MapConfirmBar } from './components/Map/MapConfirmBar'

import { useMap } from '@/providers/MapProvider'
import { useLocation } from '@/context/LocationContext'
import { useRideFlowStore } from '@/storage/store/useRideFlowStore'
import { useRideRoute } from '@/hooks/ride/useRideRoute'
import { useFareCalculation } from '@/hooks/ride/useFareCalculation'
import { useRideSummary } from '@/hooks/useRideSummary'
import { getAddressFromCoords } from '@/services/google/googleApi'
import { CustomPlace } from '@/types/places'

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

  const {
    pickup,
    dropoff,
    reset,
    setPickup,
    setDropoff,
    mapPickingMode,
    setMapPickingMode
  } = useRideFlowStore()

  const bottomSheetRef = useRef<BottomSheet>(null)

  // Map pin picking state
  const [isDragging, setIsDragging] = useState(false)
  const [pickedAddress, setPickedAddress] = useState<string | null>(null)
  const [pickedCoords, setPickedCoords] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [isGeocodingPin, setIsGeocodingPin] = useState(false)

  // Debounce ref — clear pending geocode calls during fast drags
  const geocodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset flow state every time the user enters this screen
  useEffect(() => {
    reset()
  }, [])

  // React to mapPickingMode changes — collapse or expand BottomSheet
  useEffect(() => {
    if (mapPickingMode !== null) {
      // Collapse to minimum snap (12%) to expose the map
      bottomSheetRef.current?.snapToIndex(0)
      setPickedAddress(null)
      setPickedCoords(null)
    } else {
      // Restore to initial step height (index 0 is 45% for step 1)
      bottomSheetRef.current?.snapToIndex(0)
    }
  }, [mapPickingMode])

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

  // Called continuously by expo-maps when the camera moves
  const handleCameraMove = useCallback(
    (event: any) => {
      if (!mapPickingMode) return

      const eventData = event?.nativeEvent ?? event

      const lat: number =
        eventData?.coordinates?.latitude ??
        eventData?.camera?.center?.latitude ??
        eventData?.latitude ??
        null

      const lng: number =
        eventData?.coordinates?.longitude ??
        eventData?.camera?.center?.longitude ??
        eventData?.longitude ??
        null

      if (!lat || !lng) return

      // Safely update dragging state without putting isDragging in the dependency array
      setIsDragging(prev => {
        if (!prev) {
          setPickedAddress(null)
          return true
        }
        return prev
      })

      if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current)

      // Debounce to simulate camera idle
      geocodeTimerRef.current = setTimeout(async () => {
        setIsDragging(false)
        setPickedCoords({ latitude: lat, longitude: lng })
        setIsGeocodingPin(true)

        try {
          const result = await getAddressFromCoords(lat, lng)
          if (typeof result === 'string') {
            setPickedAddress(result)
          } else {
            setPickedAddress(
              result.addr || result.shortAddr || 'Localização seleccionada'
            )
          }
        } catch {
          setPickedAddress('Não foi possível obter o endereço...')
        } finally {
          setIsGeocodingPin(false)
        }
      }, 850)
    },
    [mapPickingMode]
  )

  // Confirm pin — save coordinates as pickup or dropoff
  const handleConfirmPin = useCallback(() => {
    if (!pickedCoords || !pickedAddress || !mapPickingMode) return

    const place: CustomPlace = {
      description: pickedAddress,
      place_id: `pin_${mapPickingMode}_${Date.now()}`,
      name: pickedAddress,
      latitude: pickedCoords.latitude,
      longitude: pickedCoords.longitude
    }

    if (mapPickingMode === 'pickup') {
      setPickup(place)
    } else {
      setDropoff(place)
    }

    setMapPickingMode(null)
  }, [
    pickedCoords,
    pickedAddress,
    mapPickingMode,
    setPickup,
    setDropoff,
    setMapPickingMode
  ])

  // Cancel pin picking
  const handleCancelPin = useCallback(() => {
    if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current)
    setMapPickingMode(null)
  }, [setMapPickingMode])

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
      {/* Floating Address Bar (Top) — hidden during pin picking */}
      {!mapPickingMode && (
        <View className="absolute top-safe left-0 right-0 z-10">
          <AddressDisplay
            address={address ?? 'Não foi possível obter o endereço...'}
            isLoading={isGettingAddress}
          />
        </View>
      )}

      {/* Full-Screen Map wrapped to intercept touches instantly */}
      <View 
        className="flex-1"
        onTouchStart={() => {
          if (mapPickingMode) {
            setIsDragging(true)
            setPickedAddress(null)
            if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current)
          }
        }}
      >
        <PlatformMapView
          ref={mapRef}
          style={{ flex: 1 }}
          cameraPosition={initialCamera}
          markers={markers}
          onMapLoaded={handleMapReady}
          onCameraMove={handleCameraMove}
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
      </View>

      {/* Map Pin Picking Mode UI */}
      {mapPickingMode && (
        <>
          <MapPinOverlay mode={mapPickingMode} isDragging={isDragging} />
          <MapConfirmBar
            mode={mapPickingMode}
            address={pickedAddress}
            isLoading={isGeocodingPin}
            onConfirm={handleConfirmPin}
            onCancel={handleCancelPin}
          />
        </>
      )}

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
