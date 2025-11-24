// src/screens/Ride/RideSummaryScreen.tsx
import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  Alert,
  Linking,
  Platform,
  BackHandler,
  Vibration
} from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'

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
import { RideStatusArrival } from './components/RideStatusArrival'
import { RideStatusDelivering } from './components/RideStatusDelivering'
import { RideStatusArrivedDestination } from './components/RideStatusArrivedDestination'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { DriverStatusOverlay } from './components/DriverStatusOverlay'
import ROUTES from '@/constants/routes'
import { useLocation } from '@/hooks/useLocation'
import { MyLocationButton } from './components/MyLocationButton'
import { LoadingCard } from './components/LoadingCard'
import { FloatingActionButton } from './components/FloatingActionButton'
import { OTPModal } from './components/OTPModal'
import { CancelRideModal } from './components/CancelRideModal'
import { ArrivalConfirmationModal } from './components/ArrivalConfirmationModal'
import { Text } from 'react-native'
import { RideConfirmationFlow } from './components/RideConfirmationFlow'
import { useRideRoute } from '@/hooks/ride/useRideRoute'
import { useRidesViewModel } from '@/viewModels/RideViewModel'
import { RideEntity } from '@/core/entities/Ride'
import { useFareCalculation } from '@/hooks/ride/useFareCalculation'
import { RideFareInterface } from '@/interfaces/IRideFare'
import { useAuthStore } from '@/storage/store/useAuthStore'
import { RideCompletedScreen } from './components/RideFinished'
import { RideInterface } from '@/interfaces/IRide'
import { RideStatusIdle } from './components/RideStatusIdle'
import {
  ONE_SECOND_IN_MS,
  VIBRATION_PATTERN_BOOST
} from '@/constants/vibration'
import { SafeAreaView } from 'react-native-safe-area-context'

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

  const [currentRideId, setCurrentRideId] = useState<string | undefined>(rideId)
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>()

  // Refs
  const mapRef = useRef<MapView | null>(null)
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const [isCreatingRide, setIsCreatingRide] = useState(false)

  // Estados modais
  const [showCancelModal, setShowCancelModal] = useState(false)

  // HOOK PRINCIPAL - Monitora a corrida em tempo real
  const {
    loading: isLoadingDataRide,
    ride: currentRide,
    routeCoords,
    distance,
    duration,
    rideRates,

    // Rota do motorista
    routeCoordsDriver,
    durationDriver,
    // driver,

    // distanceKm,
    fareDetails,
    rideStatus,

    // tempo
    currentTime,
    additionalTime,

    // ações
    handleCreateRide,
    handleCanceledRide
  } = useRideSummary(currentRideId)

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

  // Centralizar no pickup
  const centerOnPickup = async () => {
    const targetLocation = currentRide?.pickup || location.pickup

    if (!targetLocation) {
      Alert.alert('Erro', 'Não foi possível obter localização.')
      return
    }

    mapRef.current?.animateToRegion(
      {
        latitude: targetLocation.latitude,
        longitude: targetLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      },
      800
    )
  }

  // CRIAR NOVA CORRIDA
  const handleCreateNewRide = async () => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado')
      return
    }

    setIsCreatingRide(true)

    try {
      const rideData = {
        user: user,
        pickup: location.pickup,
        dropoff: location.dropoff,
        distance: distanceKmTemp,
        duration: durationMinutesTemp ?? 0,
        type: 'delivery' as const,
        details: {
          item: {
            type: article.type,
            description: article.description,
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
        setCurrentRideId(rideCreated.id)

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
      Alert.alert('Erro', error.message || 'Falha ao criar nova corrida')
    } finally {
      setIsCreatingRide(false)
    }
  }

  // CANCELAR CORRIDA
  const handleCancelRide = async (reason: string) => {
    try {
      if (!currentRideId) {
        Alert.alert('Erro', 'Nenhuma corrida para cancelar')
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
      Alert.alert('Erro', error.message || 'Falha ao cancelar corrida')
    }
  }

  // ATUALIZAR REGIÃO DO MAPA
  useEffect(() => {
    if (!mapRef.current || !currentRide) return

    let targetLocation = currentRide.pickup

    if (rideStatus === 'picked_up' || rideStatus === 'arrived_dropoff') {
      targetLocation = currentRide.dropoff
    }

    const region = {
      latitude: targetLocation.latitude,
      longitude: targetLocation.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    }

    mapRef.current.animateToRegion(region, 1000)
  }, [rideStatus, currentRide])

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

      Alert.alert('Está no meio de uma corrida', 'Deseja realmente sair?', [
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
        // { text: 'Sair', onPress: () => BackHandler.exitApp() },
      ])
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

  // RENDERIZAR CONTEÚDO POR STATUS
  function renderContentByStatus() {
    // Se não tem corrida criada ainda
    if (!currentRideId) {
      return (
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
            duration={durationTemp}
            isLoading={isCreatingRide}
            onConfirm={handleCreateNewRide}
            onCancel={() => navigation.goBack()}
          />
        </>
      )
    }

    // Se está carregando dados da corrida
    if (isLoadingDataRide && !currentRide) {
      return <LoadingCard />
    }

    if (rideStatus === 'completed') {
      return (
        <RideCompletedScreen
          rideId={currentRideId}
          rideDetails={currentRide as RideInterface}
        />
      )
    }
    // Baseado no status da corrida
    switch (rideStatus) {
      case 'idle':
        return (
          <>
            <RideStatusIdle
              pickupDescription={
                currentRide?.pickup.description || location.pickup.description
              }
              dropoffDescription={
                currentRide?.dropoff.description || location.dropoff.description
              }
              estimatedTime="2-5 min"
              price={formatMoney(
                fareDetails?.total || fareDetailsTemp?.total || 0,
                0
              )}
              searchStartTime={currentRide?.created_at}
              onCancel={() => setShowCancelModal(true)}
              onAutoCancel={handleCancelRide}
              onCenterMap={centerOnPickup}
            />
          </>
        )

      case 'driver_on_the_way':
        return (
          <>
            <DriverStatusOverlay
              duration={duration}
              driverName={currentRide?.driver?.name || 'Motorista'}
              estimatedTime={durationDriver}
            />
          </>
        )

      case 'arrived_pickup':
        return (
          <>
            <RideStatusArrival
              rideStatus={rideStatus}
              currentTime={currentTime}
              additionalTime={String(additionalTime)}
              customerName={currentRide?.user?.name}
            />
          </>
        )

      case 'picked_up':
        return (
          <>
            <RideStatusDelivering
              distanceTraveled={distance}
              distanceTotal={distance}
              duration={duration}
              packageInfo={currentRide?.details?.item}
              customerName={currentRide?.details?.receiver.name}
            />
          </>
        )

      case 'arrived_dropoff':
        return (
          <>
            <RideStatusArrivedDestination
              customerName={currentRide?.details?.receiver.name}
              packageInfo={currentRide?.details?.item}
            />
          </>
        )

      // case 'completed':
      // Navegar para tela de conclusão
      // if (currentRide) {
      //   navigation.navigate(ROUTES.Rides.FINISHED, {
      //     rideId: currentRideId,
      //     rideDetails: currentRide,
      //   });
      // }
      // return null;

      case 'canceled':
        // Mostrar mensagem de cancelamento
        return (
          <View className="absolute top-4 left-4 right-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <Text className="text-lg font-bold text-red-600 text-center mb-2">
              Corrida Cancelada
            </Text>
            <Text className="text-gray-600 text-center">
              Esta corrida foi cancelada. Você pode criar uma nova.
            </Text>
          </View>
        )

      default:
        return null
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* MAPA */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: currentRide?.pickup.latitude || location.pickup.latitude,
          longitude: currentRide?.pickup.longitude || location.pickup.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={true}
      >
        {/* Pontos de pickup e dropoff */}
        {(currentRide || !currentRideId) && (
          <>
            {/* Marker de Pickup */}
            <Marker
              coordinate={{
                latitude:
                  currentRide?.pickup.latitude || location.pickup.latitude,
                longitude:
                  currentRide?.pickup.longitude || location.pickup.longitude
              }}
              title="Local de Recolha"
              description={
                currentRide?.pickup.description || location.pickup.description
              }
            >
              <View className="items-center justify-center">
                <View className="w-10 h-10 bg-green-500 rounded-full border-3 border-white shadow-lg items-center justify-center">
                  <Text className="text-white font-bold text-xs">R</Text>
                </View>
              </View>
            </Marker>

            {/* Marker de Dropoff */}
            <Marker
              coordinate={{
                latitude:
                  currentRide?.dropoff.latitude || location.dropoff.latitude,
                longitude:
                  currentRide?.dropoff.longitude || location.dropoff.longitude
              }}
              title="Local de Entrega"
              description={
                currentRide?.dropoff.description || location.dropoff.description
              }
            >
              <View className="items-center justify-center">
                <View className="w-10 h-10 bg-red-500 rounded-full border-3 border-white shadow-lg items-center justify-center">
                  <Text className="text-white font-bold text-xs">E</Text>
                </View>
              </View>
            </Marker>
          </>
        )}

        {/* Rota principal */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#10B981"
            strokeWidth={4}
          />
        )}

        {/* Rota do motorista */}
        {routeCoordsDriver.length > 0 && (
          <Polyline
            coordinates={routeCoordsDriver}
            strokeColor="#007AFF"
            strokeWidth={5}
            lineDashPattern={[0]}
          />
        )}
      </MapView>

      {/* CONTENT */}
      {renderContentByStatus()}

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

      {/* MODAIS */}
      <CancelRideModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelRide}
        isLoading={false}
      />
    </SafeAreaView>
  )
}
