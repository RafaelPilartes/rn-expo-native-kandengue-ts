// src/screens/Main/History/components/RideDetailsSheetModal.tsx
import React, { forwardRef, useMemo, memo, useCallback } from 'react'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView
} from '@gorhom/bottom-sheet'
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native'
import {
  Car,
  Bike,
  Package,
  Clock,
  Navigation,
  User,
  Phone
} from 'lucide-react-native'
import { RideInterface } from '@/interfaces/IRide'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatFullDate } from '@/utils/formatDate'
import StatusTag from './StatusTag'

interface RideDetailsSheetModalProps {
  selectedRide: RideInterface | null
  snapPoints: string[]
  onChange: (index: number) => void
}

const RideDetailsSheetModal = forwardRef<
  BottomSheetModal,
  RideDetailsSheetModalProps
>(({ selectedRide, snapPoints, onChange }, ref) => {
  // Memoize displayed fare
  const displayedFare = useMemo(
    () =>
      selectedRide?.status === 'canceled' ? 0 : selectedRide?.fare?.total || 0,
    [selectedRide?.status, selectedRide?.fare?.total]
  )

  // Memoize ride type
  const rideType = useMemo(
    () => selectedRide?.type || 'car',
    [selectedRide?.type]
  )

  // Memoize backdrop to prevent rerenders
  const renderBackdrop = useMemo(
    () => (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.3}
      />
    ),
    []
  )

  // Memoized helper to get ride icon
  const rideIcon = useMemo(() => {
    switch (rideType) {
      case 'motorcycle':
        return <Bike size={24} color="#DC2626" />
      case 'delivery':
        return <Package size={24} color="#059669" />
      case 'bicycle':
        return <Bike size={24} color="#D97706" />
      default:
        return <Car size={24} color="#2563EB" />
    }
  }, [rideType])

  // Memoized helper to get ride icon bg
  const rideIconBg = useMemo(() => {
    switch (rideType) {
      case 'motorcycle':
        return 'bg-red-50'
      case 'delivery':
        return 'bg-emerald-50'
      case 'bicycle':
        return 'bg-amber-50'
      default:
        return 'bg-blue-50'
    }
  }, [rideType])

  const handleCallDriver = useCallback(() => {
    if (selectedRide?.driver?.phone) {
      Linking.openURL(`tel:${selectedRide.driver.phone}`)
    }
  }, [selectedRide?.driver?.phone])

  if (!selectedRide) return null

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      onChange={onChange}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ borderRadius: 32, backgroundColor: 'white' }}
      handleIndicatorStyle={{ backgroundColor: '#E2E8F0', width: 40 }}
      enablePanDownToClose
    >
      <BottomSheetScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-2 pb-6 border-b border-slate-100">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-row items-center gap-3">
              <View
                className={`w-12 h-12 rounded-2xl items-center justify-center ${rideIconBg}`}
              >
                {rideIcon}
              </View>
              <View>
                <Text className="text-xl font-bold text-slate-900">
                  {selectedRide.type === 'delivery' ? 'Entrega' : 'Corrida'}
                </Text>
                <Text className="text-sm text-slate-500 font-medium">
                  {formatFullDate(
                    selectedRide.created_at,
                    'dd MMM yyyy - HH:mm'
                  )}
                </Text>
              </View>
            </View>
            <StatusTag status={selectedRide.status} />
          </View>

          {/* Price Large Display */}
          <View className="items-center py-4 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
            <Text className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">
              Valor Total
            </Text>
            <Text className="text-3xl font-extrabold text-slate-900">
              {formatCurrency(displayedFare)}
            </Text>
          </View>
        </View>

        {/* Route Section */}
        <View className="px-6 py-6 border-b border-slate-100">
          <Text className="text-lg font-bold text-slate-800 mb-4">Rota</Text>

          <View className="flex-row relative">
            {/* Timeline Visual */}
            <View className="items-center mr-4 pt-1.5 h-full absolute left-0 top-0 bottom-0 z-10">
              <View
                className="w-4 h-4 rounded-full bg-white border-4 border-slate-300 shadow-sm"
                style={{ elevation: 2 }}
              />
              <View className="w-0.5 flex-1 bg-slate-200 my-1 min-h-[40px]" />
              <View
                className="w-4 h-4 rounded-sm bg-slate-800 border-2 border-white shadow-sm"
                style={{ elevation: 2 }}
              />
            </View>

            <View className="flex-1 ml-8 gap-8 pb-2">
              {/* Pickup */}
              <View>
                <Text className="text-xs font-bold text-slate-400 uppercase mb-1">
                  Ponto de Partida
                </Text>
                <Text className="text-base font-semibold text-slate-800 leading-6 mb-0.5">
                  {selectedRide.pickup.name}
                </Text>
                <Text className="text-sm text-slate-500 leading-5">
                  {selectedRide.pickup.description}
                </Text>
              </View>

              {/* Dropoff */}
              <View>
                <Text className="text-xs font-bold text-slate-400 uppercase mb-1">
                  Destino Final
                </Text>
                <Text className="text-base font-semibold text-slate-800 leading-6 mb-0.5">
                  {selectedRide.dropoff.name}
                </Text>
                <Text className="text-sm text-slate-500 leading-5">
                  {selectedRide.dropoff.description}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="px-6 py-6 border-b border-slate-100">
          <Text className="text-lg font-bold text-slate-800 mb-4">
            Detalhes da Viagem
          </Text>
          <View className="flex-row gap-4">
            <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <View className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center mb-2">
                <Clock size={16} color="#3B82F6" />
              </View>
              <Text className="text-xs text-slate-400 font-medium mb-0.5">
                Duração
              </Text>
              <Text className="text-lg font-bold text-slate-800">
                {Math.round(selectedRide.duration / 60)} min
              </Text>
            </View>

            <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <View className="w-8 h-8 bg-emerald-50 rounded-full items-center justify-center mb-2">
                <Navigation size={16} color="#10B981" />
              </View>
              <Text className="text-xs text-slate-400 font-medium mb-0.5">
                Distância
              </Text>
              <Text className="text-lg font-bold text-slate-800">
                {selectedRide.distance} km
              </Text>
            </View>
          </View>
        </View>

        {/* Driver Info */}
        {selectedRide.driver && (
          <View className="px-6 py-6 border-b border-slate-100">
            <Text className="text-lg font-bold text-slate-800 mb-4">
              Motorista
            </Text>
            <View className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                {selectedRide.driver.photo ? (
                  <Image
                    source={{ uri: selectedRide.driver.photo }}
                    className="w-12 h-12 rounded-full bg-slate-100"
                  />
                ) : (
                  <View className="w-12 h-12 rounded-full bg-slate-100 items-center justify-center">
                    <User size={20} color="#94A3B8" />
                  </View>
                )}
                <View className="ml-3 flex-1">
                  <Text className="text-base font-bold text-slate-800">
                    {selectedRide.driver.name}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-xs text-slate-500 mr-2">
                      ⭐ {selectedRide.driver.rating || '5.0'}
                    </Text>
                    <View className="w-1 h-1 bg-slate-300 rounded-full mr-2" />
                    <Text className="text-xs text-slate-500">
                      {selectedRide.driver.vehicle?.plate || 'Sem Placa'}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={handleCallDriver}
                  className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center"
                >
                  <Phone size={18} color="#1E293B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Payment Breakdown */}
        <View className="px-6 py-6 pb-12">
          <Text className="text-lg font-bold text-slate-800 mb-4">
            Pagamento
          </Text>
          <View className="bg-slate-50 p-4 rounded-2xl space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-slate-500">Preço da Corrida</Text>
              <Text className="text-slate-800 font-medium">
                {formatCurrency(displayedFare)}
                {/* {formatCurrency(selectedRide.fare?.breakdown?.base_fare || 0)} */}
              </Text>
            </View>
            {/* <View className="flex-row justify-between">
              <Text className="text-slate-500">
                Distância ({selectedRide.distance} km)
              </Text>
              <Text className="text-slate-800 font-medium">
                {formatCurrency(
                  selectedRide.fare?.breakdown?.distance_cost || 0
                )}
              </Text>
            </View> */}

            {/* Separator */}
            <View className="h-[1px] bg-slate-200 my-1" />

            <View className="flex-row justify-between items-center pt-1">
              <Text className="text-slate-900 font-bold text-lg">Total</Text>
              <Text className="text-slate-900 font-bold text-lg">
                {formatCurrency(displayedFare)}
              </Text>
            </View>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
})

export default memo(RideDetailsSheetModal)
