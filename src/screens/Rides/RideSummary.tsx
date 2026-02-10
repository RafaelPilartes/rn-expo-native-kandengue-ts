// src/screens/Ride/RideSummaryScreen.tsx
import React, { useEffect, useRef, useState } from 'react'
import { View, BackHandler, Vibration } from 'react-native'
// Replaced react-native-maps with custom RideMapContainer
// import MapView, { Marker, Polyline } from 'react-native-maps'

import { useRideSummary } from '@/hooks/useRideSummary'
import { RoutePreviewCard } from './components/RoutePreviewCard'
import { ConfirmRideCard } from './components/ConfirmRideCard'
import { DriverRideSheet } from './components/DriverRideCard'

import { CustomPlace } from '@/types/places'
import {
  CommonActions,
  useNavigation,
  useRoute
} from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParamList } from '@/types/navigation'
import { formatMoney } from '@/utils/formattedNumber'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import ROUTES from '@/constants/routes'
import { MyLocationButton } from './components/MyLocationButton'
import { LoadingCard } from './components/LoadingCard'
import { CancelRideModal } from './components/CancelRideModal'
import { useRideRoute } from '@/hooks/ride/useRideRoute'
import { useFareCalculation } from '@/hooks/ride/useFareCalculation'
import { RideFareInterface } from '@/interfaces/IRideFare'
import { useAuthStore } from '@/storage/store/useAuthStore'
import { RideCompletedScreen } from './components/RideFinished'
import { RideInterface } from '@/interfaces/IRide'
import { VIBRATION_PATTERN_BOOST } from '@/constants/vibration'
import { SafeAreaView } from 'react-native-safe-area-context'
import { calculateHeading } from '@/helpers/bearing'

// NEW COMPONENTS
import { RideMapContainer } from './components/RideMapContainer'
import { RideStatusManager } from './components/RideStatusManager'
import { RideModals } from './components/RideModals'
import { useMap } from '@/providers/MapProvider'
import { converter } from '@/utils/converter'
import { useAlert } from '@/context/AlertContext'

type RideSummaryScreenRouteParams = {
  id: string | undefined
  location: {
    pickup: CustomPlace
    dropoff: CustomPlace
  }
  receiver: { name: string; phone: string }
  article: { type: string; description: string }
}

export default function RideSummaryScreen() {
  const route = useRoute()
  const { user } = useAuthStore()

  const {
    id: rideId,
    location,
    article,
    receiver
  } = route.params as RideSummaryScreenRouteParams

  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>()
  const { showAlert } = useAlert()

  const mapRef = useRef<any>(null)

  // Refs
  // const mapRef = useRef<MapView | null>(null) // Access map via useMap now
  const { centerOnUser: mapCenterOnUser } = useMap() // Used by MapContainer internally, but maybe we need reference here?
  // Actually MapProvider manages ref. centerOnUser is exposed.

  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const [isCreatingRide, setIsCreatingRide] = useState(false)

  // Estados modais
  const [showCancelModal, setShowCancelModal] = useState(false)

  // HOOK PRINCIPAL - Monitora a corrida em tempo real
  const {
    loading: isLoadingDataRide,
    ride: currentRide,
    rideTracking,
    routeCoords,
    distance,
    duration,
    rideRates,

    // Rota do motorista
    routeCoordsDriver,
    durationDriver,
    // driver,
    durationMinutes,

    distanceKm,
    fareDetails,
    rideStatus,

    // tempo
    currentTime,
    additionalTime,

    // ações
    handleCreateRide,
    handleCanceledRide
  } = useRideSummary(rideId)

  // CÁLCULOS TEMPORÁRIOS - Para mostrar antes de criar a corrida
  const {
    routeCoords: routeCoordsTemp,
    distanceKm: distanceKmTemp,
    durationMinutes: durationMinutesTemp,
    distance: distanceTemp,
    duration: durationTemp
  } = useRideRoute(location.pickup, location.dropoff)

  const { fareDetails: fareDetailsTemp } = useFareCalculation(
    distanceKmTemp,
    durationMinutesTemp ?? 0,
    rideRates ?? null
  )

  const ridePath = rideTracking?.path || []

  let markerHeading = 0

  if (ridePath.length >= 2) {
    const lastPointTracked = ridePath[ridePath.length - 1]
    const prevPointTracked = ridePath[ridePath.length - 2]

    markerHeading = calculateHeading(
      prevPointTracked.latitude,
      prevPointTracked.longitude,
      lastPointTracked.latitude,
      lastPointTracked.longitude
    )
  }

  const centerOnDriver = async () => {
    if (!currentRide?.driver) {
      showAlert(
        'Sem motorista',
        'Não foi possível obter localização.',
        'error',
        [{ text: 'OK' }]
      )
      return
    }
    if (!currentRide?.driver?.location) {
      showAlert(
        'Sem localização',
        'Não foi possível obter localização.',
        'error',
        [{ text: 'OK' }]
      )
      return
    }

    const coords = currentRide?.driver?.location

    if (!coords) {
      showAlert('Erro', 'Não foi possível obter localização.', 'error', [
        { text: 'OK' }
      ])
      return
    }

    mapRef.current?.setCameraPosition?.({
      coordinates: coords,
      zoom: 15
    })
  }

  // Centralizar no pickup
  const centerOnPickup = async () => {
    // Logic handled by MapProvider or local map ref if exposed.
    // For now we assume mapProvider allows us to center.
    // However, mapProvider.centerOnUser centers on USER location (blue dot).
    // We want to center on PICKUP.
    // We might need to extend MapProvider or access ref directly if possible?
    // MapProvider exposes `mapRef`.
    /*
    const targetLocation = currentRide?.pickup || location.pickup
    if (!targetLocation) return
    mapRef.current?.animateToRegion(...)
    */
    // TODO: Re-verify mapProvider capabilities for centering on arbitrary points
  }

  // CRIAR NOVA CORRIDA
  const handleCreateNewRide = async () => {
    if (!user) {
      showAlert('Erro', 'Usuário não autenticado', 'error')
      return
    }

    setIsCreatingRide(true)

    try {
      // @ts-expect-error CreateParams type mismatch with pickup.description
      const rideData: CreateParams = {
        user: user,
        pickup: location.pickup,
        dropoff: location.dropoff,
        distance: distanceKmTemp,
        duration: durationMinutesTemp ?? 0,
        type: 'delivery' as const,
        details: {
          item: {
            type: article.type,
            description: article.description || '', // Ensure string
            quantity: 1,
            size: 'medium' as const
          },
          receiver: {
            name: receiver.name,
            phone: receiver.phone
          }
        },
        fare: fareDetailsTemp as RideFareInterface,
        status: 'idle' as const
      }

      const rideCreated = await handleCreateRide(rideData)

      if (rideCreated?.id) {
        // setCurrentRideId removed, relying on navigation params

        // Navegar para a mesma tela com o ID da corrida
        navigation.dispatch(
          CommonActions.setParams({
            id: rideCreated.id,
            location,
            receiver,
            article
          })
        )
      } else {
        throw new Error('ID da corrida não retornado')
      }
    } catch (error: any) {
      console.error('❌ Erro ao criar corrida:', error)
      showAlert('Erro', error.message || 'Falha ao criar nova corrida', 'error') // Replaced Alert.alert
    } finally {
      setIsCreatingRide(false)
    }
  }

  // CANCELAR CORRIDA
  const handleCancelRide = async (reason: string) => {
    try {
      if (!rideId) {
        showAlert('Erro', 'Nenhuma corrida para cancelar', 'error')
        return
      }

      await handleCanceledRide(reason)
      setShowCancelModal(false)

      // Navegar de volta
      setTimeout(() => {
        if (navigation.canGoBack()) navigation.goBack()
      }, 2000)
    } catch (error: any) {
      console.error('❌ Erro ao cancelar corrida:', error)
      showAlert('Erro', error.message || 'Falha ao cancelar corrida', 'error')
    }
  }

  // CONTROLAR BOTTOM SHEET
  useEffect(() => {
    const hasDriver = [
      'driver_on_the_way',
      'arrived_pickup',
      'picked_up',
      'arrived_dropoff'
    ].includes(rideStatus)

    if (hasDriver && currentRide) {
      bottomSheetRef.current?.present()
    } else {
      bottomSheetRef.current?.dismiss()
    }
  }, [rideStatus, currentRide, navigation])

  // LIMPAR AO SAIR DA TELA
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      bottomSheetRef.current?.close()
    })

    return unsubscribe
  }, [navigation])

  // PREVENIR SAIDA DA TELA
  useEffect(() => {
    const backAction = () => {
      if (!rideId) return

      showAlert(
        'Está no meio de uma corrida',
        'Deseja realmente sair?',
        'warning',
        [
          {
            text: 'Ficar',
            onPress: () => null,
            style: 'cancel'
          },
          {
            text: 'Sair',
            onPress: () => {
              if (navigation.canGoBack()) {
                navigation.replace(ROUTES.HomeStack.HOME)
              }
            }
          }
        ]
      )
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [])

  // VIBRAR SEMPRE QUE O STATUS MUDAR
  useEffect(() => {
    if (!rideId) return
    if (rideStatus) {
      Vibration.vibrate(VIBRATION_PATTERN_BOOST)
    }
  }, [rideStatus])

  // ATUALIZAR REGIÃO DO MAPA BASEADO NO STATUS
  useEffect(() => {
    if (!rideId) return
    if (!mapRef.current || !currentRide?.driver?.location) return

    let targetLocation = location.pickup

    if (rideStatus === 'picked_up' || rideStatus === 'arrived_dropoff') {
      targetLocation = location.dropoff
    }

    if (rideStatus === 'driver_on_the_way' || rideStatus === 'arrived_pickup') {
      targetLocation = currentRide?.driver?.location
    }

    if (targetLocation) {
      mapRef.current?.animateToRegion({
        coordinates: {
          latitude: targetLocation.latitude,
          longitude: targetLocation.longitude
        },
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
        zoom: 14
      })
    }

    if (rideStatus) {
      Vibration.vibrate(VIBRATION_PATTERN_BOOST)
    }
  }, [rideStatus, location, currentRide?.driver?.location])

  // Determine Map Props
  const pickupProp =
    currentRide || !rideId
      ? {
          latitude: currentRide?.pickup.latitude ?? location.pickup.latitude,
          longitude: currentRide?.pickup.longitude ?? location.pickup.longitude,
          title: 'Local de Recolha',
          description:
            currentRide?.pickup.description || location.pickup.description
        }
      : undefined

  const dropoffProp =
    currentRide || !rideId
      ? {
          latitude: currentRide?.dropoff.latitude ?? location.dropoff.latitude,
          longitude:
            currentRide?.dropoff.longitude ?? location.dropoff.longitude,
          title: 'Local de Entrega',
          description:
            currentRide?.dropoff.description || location.dropoff.description
        }
      : undefined

  const driverLoc =
    ridePath && ridePath.length >= 1 && currentRide?.driver
      ? {
          latitude: ridePath[ridePath.length - 1].latitude,
          longitude: ridePath[ridePath.length - 1].longitude,
          rotation: markerHeading
        }
      : undefined

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 1. MAP CONTAINER */}

      <RideMapContainer
        mapRef={mapRef}
        currentRide={currentRide || null}
        location={{
          pickup: pickupProp,
          dropoff: dropoffProp
        }}
        rideStatus={rideStatus}
        routeCoords={routeCoords}
        driverLocation={driverLoc}
        routeCoordsTemp={routeCoordsTemp}
        routeCoordsDriver={routeCoordsDriver}
      />

      {/* 2. MAIN CONTENT (STATUS MANAGER) */}
      {!rideId ? (
        <>
          <RoutePreviewCard
            pickupDescription={location.pickup.name ?? ''}
            dropoffDescription={location.dropoff.name ?? ''}
          />

          <View style={{ position: 'absolute', bottom: 180, left: 28 }}>
            <MyLocationButton onPress={centerOnPickup} />
          </View>

          <ConfirmRideCard
            price={formatMoney(fareDetailsTemp?.total || 0, 0)}
            duration={String(durationTemp)}
            distance={distanceTemp}
            isLoading={isCreatingRide}
            onConfirm={handleCreateNewRide}
            onCancel={() => navigation.goBack()}
          />
        </>
      ) : isLoadingDataRide && !currentRide ? (
        <LoadingCard />
      ) : rideStatus === 'completed' ? (
        <RideCompletedScreen
          rideId={rideId}
          rideDetails={currentRide as RideInterface}
        />
      ) : (
        <RideStatusManager
          status={rideStatus}
          // Props mappings
          pickupDescription={
            currentRide?.pickup.description || location.pickup.description
          }
          dropoffDescription={
            currentRide?.dropoff.description || location.dropoff.description
          }
          price={formatMoney(
            fareDetails?.total || fareDetailsTemp?.total || 0,
            0
          )}
          searchStartTime={currentRide?.created_at}
          onCancel={() => setShowCancelModal(true)}
          onAutoCancel={handleCancelRide}
          onCenterMap={centerOnPickup}
          duration={durationMinutes}
          driverName={currentRide?.driver?.name}
          driverDuration={durationDriver}
          currentTime={currentTime ?? 0}
          additionalTime={String(additionalTime)}
          customerName={
            currentRide?.user?.name || currentRide?.details?.receiver.name
          }
          packageInfo={currentRide?.details?.item}
          distanceTraveled={distanceKm}
          distanceTotal={distanceKm}
        />
      )}

      {/* 3. MODALS AND SHEETS */}
      {/* DRIVER RIDE SHEET */}
      {currentRide && currentRide.driver && (
        <DriverRideSheet
          ref={bottomSheetRef}
          rideData={currentRide}
          rideStatus={rideStatus}
          distance={distance}
          onCancel={() => setShowCancelModal(true)}
          snapPoints={['26%', '40%']}
        />
      )}

      <RideModals />
      {/* Keeping CancelRideModal here for now as it uses local state 'showCancelModal' */}
      <CancelRideModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelRide}
        isLoading={false}
      />
    </SafeAreaView>
  )
}
