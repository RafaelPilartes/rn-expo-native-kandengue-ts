// src/screens/Ride/RideSummaryScreen.tsx
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { BackHandler, Vibration } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Hooks
import { useRideSummary } from '@/hooks/useRideSummary'
import { useRideRoute } from '@/hooks/ride/useRideRoute'
import { useFareCalculation } from '@/hooks/ride/useFareCalculation'
import { useAuthStore } from '@/storage/store/useAuthStore'
import { useAlert } from '@/context/AlertContext'
import {
  CommonActions,
  useNavigation,
  useRoute
} from '@react-navigation/native'

// Types
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParamList } from '@/types/navigation'
import { CustomPlace } from '@/types/places'
import { RideFareInterface } from '@/interfaces/IRideFare'
import ROUTES from '@/constants/routes'
import { VIBRATION_PATTERN_BOOST } from '@/constants/vibration'

// Components
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { calculateHeading } from '@/helpers/bearing'
import { RideMapContainer } from './components/Map/RideMapContainer'
import { DriverRideSheet } from './components/Cards/DriverRideCard'
import { RideModals } from './components/Modals/RideModals'
import { CancelRideModal } from './components/Modals/CancelRideModal'
import { RideEstimationView } from './components/Views/RideEstimationView'
import { RideTrackingView } from './components/Views/RideTrackingView'
import { RideInterface } from '@/interfaces/IRide'
import { useNetwork } from '@/hooks/useNetwork'
import { useMap } from '@/providers/MapProvider'

type RideSummaryScreenRouteParams = {
  id: string | undefined
  location: {
    pickup: CustomPlace
    dropoff: CustomPlace
  }
  receiver: { name: string; phone: string }
  article: { type: string; description: string }
  // Fields from the new unified flow
  sender?: { name: string; phone: string }
  pickupOption?: 'door' | 'curb'
  paymentMethod?: 'cash' | 'card' | 'wallet'
  driverInstructions?: string
}

export default function RideSummaryScreen() {
  const route = useRoute()
  const { user } = useAuthStore()
  const { isConnected } = useNetwork()

  const {
    id: rideId,
    location,
    article,
    receiver,
    sender,
    pickupOption,
    paymentMethod,
    driverInstructions
  } = route.params as RideSummaryScreenRouteParams

  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>()
  const { showAlert } = useAlert()

  const { centerOnPoint, mapRef } = useMap()

  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const [isCreatingRide, setIsCreatingRide] = useState(false)
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
    0, // Initial wait time is 0
    rideRates ?? null
  )

  const ridePath = rideTracking?.path || []

  // Memoize heading calculation
  const markerHeading = useMemo(() => {
    if (ridePath.length >= 2) {
      const lastPointTracked = ridePath[ridePath.length - 1]
      const prevPointTracked = ridePath[ridePath.length - 2]

      return calculateHeading(
        prevPointTracked.latitude,
        prevPointTracked.longitude,
        lastPointTracked.latitude,
        lastPointTracked.longitude
      )
    }
    return 0
  }, [ridePath])

  // Center on Pickup Callback
  const centerOnPickup = useCallback(async () => {
    await centerOnPoint(location.pickup)
  }, [])

  // Create Ride Callback
  const handleCreateNewRide = useCallback(async () => {
    if (!isConnected) {
      showAlert(
        'Atenção',
        'Por favor, verifique sua conexão com a internet para poder solicitar uma entrega',
        'warning'
      )
      return
    }

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
            description: article.description || '',
            quantity: 1,
            size: 'medio' as const
          },
          receiver: {
            name: receiver.name,
            phone: receiver.phone
          },
          sender: sender
            ? { name: sender.name, phone: sender.phone }
            : undefined,
          pickup_option: pickupOption,
          payment_method: paymentMethod
        },
        fare: fareDetailsTemp as RideFareInterface,
        status: 'idle' as const
      }

      const rideCreated = await handleCreateRide(rideData)

      if (rideCreated?.id) {
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
      showAlert('Erro', error.message || 'Falha ao criar nova corrida', 'error')
    } finally {
      setIsCreatingRide(false)
    }
  }, [
    user,
    location,
    distanceKmTemp,
    durationMinutesTemp,
    article,
    receiver,
    fareDetailsTemp,
    handleCreateRide,
    navigation,
    showAlert
  ])

  // Cancel Ride Callback
  const handleCancelRide = useCallback(
    async (reason: string) => {
      // Close modal immediately
      setShowCancelModal(false)

      if (!isConnected) {
        showAlert(
          'Atenção',
          'Por favor, verifique sua conexão com a internet para poder cancelar a entrega',
          'warning'
        )
        return
      }

      try {
        if (!rideId) {
          showAlert('Erro', 'Nenhuma corrida para cancelar', 'error')
          return
        }

        await handleCanceledRide(reason)

        // Navegar de volta
        setTimeout(() => {
          if (navigation.canGoBack()) navigation.goBack()
        }, 1500)
      } catch (error: any) {
        console.error('❌ Erro ao cancelar corrida:', error)
        showAlert('Erro', error.message || 'Falha ao cancelar corrida', 'error')
      }
    },
    [rideId, handleCanceledRide, navigation, showAlert, isConnected]
  )

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
  }, [rideStatus, currentRide]) // Removed navigation dependency

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
  }, [rideId, navigation, showAlert]) // Added dependencies

  // VIBRAR SEMPRE QUE O STATUS MUDAR
  useEffect(() => {
    if (!rideId) return
    if (rideStatus) {
      Vibration.vibrate(VIBRATION_PATTERN_BOOST)
    }
  }, [rideStatus, rideId])

  // Memoize Map Props
  const pickupProp = useMemo(
    () =>
      currentRide || !rideId
        ? {
            latitude: currentRide?.pickup.latitude ?? location.pickup.latitude,
            longitude:
              currentRide?.pickup.longitude ?? location.pickup.longitude,
            title: 'Local de Recolha',
            description:
              currentRide?.pickup.description || location.pickup.description
          }
        : undefined,
    [currentRide, rideId, location.pickup]
  )

  const dropoffProp = useMemo(
    () =>
      currentRide || !rideId
        ? {
            latitude:
              currentRide?.dropoff.latitude ?? location.dropoff.latitude,
            longitude:
              currentRide?.dropoff.longitude ?? location.dropoff.longitude,
            title: 'Local de Entrega',
            description:
              currentRide?.dropoff.description || location.dropoff.description
          }
        : undefined,
    [currentRide, rideId, location.dropoff]
  )

  const driverLoc = useMemo(
    () =>
      ridePath && ridePath.length >= 1 && currentRide?.driver
        ? {
            latitude: ridePath[ridePath.length - 1].latitude,
            longitude: ridePath[ridePath.length - 1].longitude,
            rotation: markerHeading
          }
        : undefined,
    [ridePath, currentRide?.driver, markerHeading]
  )

  // ATUALIZAR REGIÃO DO MAPA BASEADO NO STATUS
  useEffect(() => {
    if (!rideId || !mapRef.current) return

    let targetLocation: { latitude: number; longitude: number } | undefined

    switch (rideStatus) {
      case 'picked_up':
      case 'arrived_dropoff':
        targetLocation = location.dropoff
        break

      case 'driver_on_the_way':
      case 'arrived_pickup':
        targetLocation = driverLoc ?? location.pickup
        break

      default:
        targetLocation = location.pickup
        break
    }

    if (targetLocation) {
      mapRef.current?.setCameraPosition?.({
        coordinates: {
          latitude: targetLocation.latitude,
          longitude: targetLocation.longitude
        },
        zoom: 14
      })
    }
  }, [rideStatus, location, driverLoc, rideId])

  const mapLocationProp = useMemo(
    () => ({
      pickup: pickupProp,
      dropoff: dropoffProp
    }),
    [pickupProp, dropoffProp]
  )

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 1. MAP CONTAINER */}
      <RideMapContainer
        mapRef={mapRef}
        currentRide={currentRide || null}
        location={mapLocationProp}
        rideStatus={rideStatus}
        routeCoords={routeCoords}
        driverLocation={driverLoc}
        routeCoordsTemp={routeCoordsTemp}
        routeCoordsDriver={routeCoordsDriver}
      />

      {/* 2. MAIN CONTENT (STATUS MANAGER vs ESTIMATION) */}
      {!rideId ? (
        <RideEstimationView
          location={location}
          fareDetails={fareDetailsTemp}
          distance={distanceTemp}
          duration={String(durationTemp)}
          isLoading={isCreatingRide}
          onConfirm={handleCreateNewRide}
          onCancel={() => navigation.goBack()}
          onCenterMap={centerOnPickup}
        />
      ) : (
        <RideTrackingView
          rideId={rideId}
          currentRide={currentRide as RideInterface}
          isLoadingData={isLoadingDataRide}
          rideStatus={rideStatus}
          location={location}
          fareDetails={fareDetails}
          fareDetailsTemp={fareDetailsTemp}
          durationMinutes={durationMinutes}
          durationDriver={durationDriver}
          distanceKm={distanceKm}
          currentTime={currentTime}
          additionalTime={Number(additionalTime)}
          onCancel={() => setShowCancelModal(true)}
          onAutoCancel={handleCancelRide}
          onCenterMap={centerOnPickup}
        />
      )}

      {/* 3. MODALS AND SHEETS */}
      {/* DRIVER RIDE SHEET */}
      {currentRide && currentRide.driver && (
        <DriverRideSheet
          ref={bottomSheetRef}
          rideData={currentRide}
          fareDetails={fareDetails}
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
