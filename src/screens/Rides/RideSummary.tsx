// src/screens/Rides/RideSummary.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { BackHandler, Vibration } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  CommonActions,
  useNavigation,
  useRoute
} from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BottomSheetModal } from '@gorhom/bottom-sheet'

// Hooks
import { useRideSummary } from '@/hooks/ride/useRideSummary'
import { useAuthStore } from '@/storage/store/useAuthStore'
import { useAlert } from '@/context/AlertContext'
import { useNetwork } from '@/hooks/useNetwork'
import { useMap } from '@/providers/MapProvider'

// Types
import { HomeStackParamList } from '@/types/navigation'
import { CustomPlace } from '@/types/places'
import { RideFareInterface } from '@/interfaces/IRideFare'
import { RideInterface } from '@/interfaces/IRide'
import { CreateRideParams } from '@/hooks/ride/useRideFlow'
import ROUTES from '@/constants/routes'
import { VIBRATION_PATTERN_BOOST } from '@/constants/vibration'

// Components
import { RideMapContainer } from './components/Map/RideMapContainer'
import { DriverRideSheet } from './components/Cards/DriverRideCard'
import { CancelRideModal } from './components/Modals/CancelRideModal'
import { RideEstimationView } from './components/Views/RideEstimationView'
import { RideTrackingView } from './components/Views/RideTrackingView'
import { PromoCodeField } from './components/Cards/PromoCodeField'
import { usePromotionViewModel } from '@/viewModels/PromotionViewModel'

type RideSummaryScreenRouteParams = {
  id: string | undefined
  location: {
    pickup: CustomPlace
    dropoff: CustomPlace
  }
  receiver: { name: string; phone: string }
  article: { type: string; description: string }
  sender?: { name: string; phone: string }
  pickupOption?: 'door' | 'curb'
  paymentMethod?: 'cash' | 'card' | 'wallet'
  driverInstructions?: string
}

export default function RideSummaryScreen() {
  const routeNav = useRoute()
  const { user } = useAuthStore()
  const { isConnected } = useNetwork()
  const { showAlert } = useAlert()
  const { centerOnPoint, mapRef } = useMap()
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>()

  const {
    id: rideId,
    location,
    article,
    receiver,
    sender,
    pickupOption,
    paymentMethod,
    driverInstructions
  } = routeNav.params as RideSummaryScreenRouteParams

  // Local UI state
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const [isCreatingRide, setIsCreatingRide] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Promo code flow
  const {
    feedback: promoFeedback,
    validate: validatePromo,
    apply: applyPromo,
    reset: resetPromo,
  } = usePromotionViewModel()

  // Unified hook — one source of truth for everything
  const {
    loading,
    rideStatus,
    currentRide,
    route,
    driverRoute,
    driver,
    fareDetails,
    waitTimer,
    actions
  } = useRideSummary({
    rideId,
    previewPickup: location.pickup,
    previewDropoff: location.dropoff
  })

  // Pickup/dropoff with description for map markers
  const pickupMarker = {
    ...location.pickup,
    name: currentRide?.pickup?.description ?? location.pickup.name,
    description: currentRide?.pickup?.description ?? location.pickup.description
  }

  const dropoffMarker = {
    ...location.dropoff,
    name: currentRide?.dropoff?.description ?? location.dropoff.name,
    description:
      currentRide?.dropoff?.description ?? location.dropoff.description
  }

  // ─── Actions ──────────────────────────────────────────

  const centerOnPickup = useCallback(async () => {
    await centerOnPoint(location.pickup)
  }, [centerOnPoint, location.pickup])

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
      // Reservar código promocional (se houver) antes de criar a ride.
      // O promotion_usage_id retornado é anexado à ride para o trigger
      // onRideCreated vincular a reserva permanentemente.
      let promoApplied:
        | { promotion_id: string; promotion_usage_id: string }
        | undefined

      if (promoFeedback.state === 'valid') {
        try {
          const result = await applyPromo({
            code: promoFeedback.result.code_applied,
            ride_context: {
              city_origin: location.pickup.name ?? '',
              city_destination: location.dropoff.name ?? '',
              ride_type: 'delivery',
              estimated_price: fareDetails?.total ?? 0,
              payment_method: paymentMethod ?? 'cash',
            },
          })
          promoApplied = {
            promotion_id: result.promotion_id,
            promotion_usage_id: result.promotion_usage_id,
          }
        } catch (err: any) {
          showAlert(
            'Código promocional',
            err.message || 'Não foi possível aplicar o código',
            'warning',
          )
          setIsCreatingRide(false)
          return
        }
      }

      // Constrói a fare final com desconto incluído (se promo foi aplicada).
      // gross_amount guarda sempre o bruto para o trigger onRideCompleted.
      const baseFare = fareDetails as RideFareInterface
      const grossAmount = baseFare.total
      const finalFare: RideFareInterface =
        promoApplied && promoFeedback.state === 'valid'
          ? {
              ...baseFare,
              total: promoFeedback.result.final_price,
              breakdown: {
                ...baseFare.breakdown,
                gross_amount: grossAmount,
                discount: promoFeedback.result.discount_amount,
                promotion_id: promoApplied.promotion_id,
                promotion_code: promoFeedback.result.code_applied,
              },
            }
          : {
              ...baseFare,
              breakdown: { ...baseFare.breakdown, gross_amount: grossAmount },
            }

      const rideData: CreateRideParams = {
        pickup: {
          description: location.pickup.description ?? '',
          place_id: location.pickup.place_id ?? '',
          name: location.pickup.name,
          latitude: location.pickup.latitude,
          longitude: location.pickup.longitude
        },
        dropoff: {
          description: location.dropoff.description ?? '',
          place_id: location.dropoff.place_id ?? '',
          name: location.dropoff.name,
          latitude: location.dropoff.latitude,
          longitude: location.dropoff.longitude
        },
        distance: route.distanceKm,
        duration: route.durationMinutes ?? 0,
        type: 'delivery' as const,
        details: {
          item: {
            type: article.type,
            description: article.description || '',
            quantity: 1,
            size: 'medium' as const
          },
          receiver: { name: receiver.name, phone: receiver.phone },
          sender: sender
            ? { name: sender.name, phone: sender.phone }
            : undefined,
          pickup_option: pickupOption,
          payment_method: paymentMethod,
          driver_instructions: driverInstructions
        },
        fare: finalFare,
        ...(promoApplied
          ? {
              promotion_id: promoApplied.promotion_id,
              promotion_usage_id: promoApplied.promotion_usage_id,
            }
          : {})
      }

      const rideCreated = await actions.createRide(rideData)

      if (rideCreated?.id) {
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
    isConnected,
    location,
    route.distanceKm,
    route.durationMinutes,
    article,
    receiver,
    sender,
    pickupOption,
    paymentMethod,
    driverInstructions,
    fareDetails,
    actions,
    navigation,
    showAlert,
    promoFeedback,
    applyPromo
  ])

  // Validar código promocional contra contexto da ride
  const handlePromoValidate = useCallback(
    async (code: string) => {
      try {
        await validatePromo({
          code,
          ride_context: {
            city_origin: location.pickup.name ?? '',
            city_destination: location.dropoff.name ?? '',
            ride_type: 'delivery',
            estimated_price: fareDetails?.total ?? 0,
            payment_method: paymentMethod ?? 'cash',
          },
        })
      } catch {
        // PromotionViewModel já trata o erro via feedback
      }
    },
    [validatePromo, location, fareDetails, paymentMethod]
  )

  const handleCancelRide = useCallback(
    async (reason: string) => {
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

        await actions.cancelRide(reason)

        setTimeout(() => {
          if (navigation.canGoBack()) navigation.goBack()
        }, 1500)
      } catch (error: any) {
        showAlert(
          'Erro',
          error.message || 'Falha ao cancelar corrida',
          'error'
        )
      }
    },
    [rideId, actions, navigation, showAlert, isConnected]
  )

  // ─── Lifecycle Effects ────────────────────────────────

  // Bottom sheet visibility based on driver assignment
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
  }, [rideStatus, currentRide])

  // Bottom sheet focus/blur handling
  useEffect(() => {
    const unBlur = navigation.addListener('blur', () => {
      bottomSheetRef.current?.close()
    })
    const unFocus = navigation.addListener('focus', () => {
      bottomSheetRef.current?.present()
    })
    return () => {
      unBlur()
      unFocus()
    }
  }, [navigation])

  // Prevent accidental back navigation during active ride
  useEffect(() => {
    const backAction = () => {
      if (!rideId) return false

      showAlert(
        'Está no meio de uma corrida',
        'Deseja realmente sair?',
        'warning',
        [
          { text: 'Ficar', onPress: () => null, style: 'cancel' },
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

    const handler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )
    return () => handler.remove()
  }, [rideId, navigation, showAlert])

  // Vibrate on status change
  useEffect(() => {
    if (!rideId || !rideStatus) return
    Vibration.vibrate(VIBRATION_PATTERN_BOOST)
  }, [rideStatus, rideId])

  // ─── Render ───────────────────────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 1. MAP */}
      <RideMapContainer
        mapRef={mapRef}
        rideStatus={rideStatus}
        pickup={pickupMarker}
        dropoff={dropoffMarker}
        driver={driver}
        route={route}
        driverRoute={driverRoute}
      />

      {/* 2. CONTENT: Estimation (pre-ride) or Tracking (active ride) */}
      {!rideId ? (
        <RideEstimationView
          location={location}
          fareDetails={fareDetails}
          distance={route.distanceText}
          duration={route.durationText}
          isLoading={isCreatingRide}
          onConfirm={handleCreateNewRide}
          onCancel={() => navigation.goBack()}
          onCenterMap={centerOnPickup}
          promoSlot={
            <PromoCodeField
              feedback={promoFeedback}
              onValidate={handlePromoValidate}
              onClear={resetPromo}
              disabled={isCreatingRide}
            />
          }
          promoDiscountAmount={
            promoFeedback.state === 'valid'
              ? promoFeedback.result.discount_amount
              : undefined
          }
          promoFinalPrice={
            promoFeedback.state === 'valid'
              ? promoFeedback.result.final_price
              : undefined
          }
        />
      ) : (
        <RideTrackingView
          rideId={rideId}
          currentRide={currentRide as RideInterface}
          isLoadingData={loading}
          rideStatus={rideStatus}
          fareDetails={fareDetails}
          route={route}
          driverRoute={driverRoute}
          waitTimer={waitTimer}
          onCancel={() => setShowCancelModal(true)}
          onAutoCancel={handleCancelRide}
          onCenterMap={centerOnPickup}
        />
      )}

      {/* 3. DRIVER BOTTOM SHEET */}
      {currentRide?.driver && (
        <DriverRideSheet
          ref={bottomSheetRef}
          rideData={currentRide}
          fareDetails={fareDetails}
          rideStatus={rideStatus}
          distance={route.distanceText}
          onCancel={() => setShowCancelModal(true)}
          snapPoints={['26%', '40%']}
        />
      )}

      {/* 4. CANCEL MODAL */}
      <CancelRideModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelRide}
        isLoading={false}
      />
    </SafeAreaView>
  )
}
