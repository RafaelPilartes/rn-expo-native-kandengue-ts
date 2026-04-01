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
  MapPin,
  User,
  Phone,
  ShieldCheck,
  Star
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

const VehicleIcon = ({ type }: { type?: string }) => {
  switch (type) {
    case 'motorcycle':
      return <Bike size={22} color="#1F2937" />
    case 'delivery':
      return <Package size={22} color="#1F2937" />
    default:
      return <Car size={22} color="#1F2937" />
  }
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
        opacity={0.4}
      />
    ),
    []
  )

  // Memoized helper to get ride icon
  const rideIcon = useMemo(() => {
    switch (rideType) {
      case 'motorcycle':
        return <Bike size={24} color="#EF4444" />
      case 'delivery':
        return <Package size={24} color="#10B981" />
      case 'bicycle':
        return <Bike size={24} color="#F59E0B" />
      default:
        return <Car size={24} color="#3B82F6" />
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

  // Ensure consistent padding and a premium feel
  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      onChange={onChange}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ borderRadius: 32, backgroundColor: 'white' }}
      handleIndicatorStyle={{
        backgroundColor: '#CBD5E1',
        width: 44,
        height: 5
      }}
      enablePanDownToClose
    >
      <BottomSheetScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header & Status */}
        <View className="px-6 pt-4 pb-6 border-b border-gray-100">
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-row items-center gap-3">
              <View
                className={`w-12 h-12 rounded-2xl items-center justify-center ${rideIconBg}`}
              >
                {rideIcon}
              </View>
              <View>
                <Text className="text-xl font-bold text-gray-900">
                  {selectedRide.type === 'delivery' ? 'Entrega' : 'Corrida'}
                </Text>
                <Text className="text-xs text-gray-500 font-medium mt-0.5">
                  {formatFullDate(
                    selectedRide.created_at,
                    'dd MMM yyyy - HH:mm'
                  )}
                </Text>
              </View>
            </View>
            <StatusTag status={selectedRide.status} />
          </View>

          {/* Premium Price Display */}
          <View className="items-center py-5 bg-gray-50 rounded-3xl border border-gray-100">
            <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">
              Valor Total
            </Text>
            <Text className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {formatCurrency(displayedFare)}
            </Text>
          </View>
        </View>

        {/* Route Section */}
        <View className="px-6 py-6 border-b border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-5">
            Rota da Viagem
          </Text>

          <View className="flex-col pb-2">
            {/* Pickup Location */}
            <View className="flex-row relative z-10">
              <View className="w-4 mr-4 items-center mt-1">
                <View className="w-4 h-4 rounded-full bg-white border-4 border-green-500 shadow-sm z-10" />
              </View>
              <View className="flex-1 pb-8">
                <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Origem
                </Text>
                <Text className="text-base font-bold text-gray-800 leading-6 mb-1">
                  {selectedRide.pickup.name}
                </Text>
                <Text className="text-sm text-gray-500 leading-5">
                  {selectedRide.pickup.description}
                </Text>
              </View>
              {/* Connecting Line */}
              <View className="absolute top-5 left-[7px] w-[2px] bg-gray-200 z-0 bottom-0" />
            </View>

            {/* Dropoff Location */}
            <View className="flex-row relative z-10">
              <View className="w-4 mr-4 items-center mt-1">
                <View className="w-4 h-4 rounded-sm bg-white border-4 border-red-500 shadow-sm z-10" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Destino Final
                </Text>
                <Text className="text-base font-bold text-gray-800 leading-6 mb-1">
                  {selectedRide.dropoff.name}
                </Text>
                <Text className="text-sm text-gray-500 leading-5">
                  {selectedRide.dropoff.description}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="px-6 py-6 border-b border-gray-100">
          <View className="flex-row gap-4">
            <View className="flex-1 bg-gray-50 p-4 rounded-2xl flex-row items-center">
              <View className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-full items-center justify-center mr-3">
                <Clock size={18} color="#6B7280" />
              </View>
              <View>
                <Text className="text-xs text-gray-400 font-medium">
                  Duração
                </Text>
                <Text className="text-sm font-bold text-gray-900 mt-0.5">
                  {Math.round(selectedRide.duration / 60)} min
                </Text>
              </View>
            </View>

            <View className="flex-1 bg-gray-50 p-4 rounded-2xl flex-row items-center">
              <View className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-full items-center justify-center mr-3">
                <MapPin size={18} color="#6B7280" />
              </View>
              <View>
                <Text className="text-xs text-gray-400 font-medium">
                  Distância
                </Text>
                <Text className="text-sm font-bold text-gray-900 mt-0.5">
                  {selectedRide.distance} km
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Driver & Vehicle Info */}
        {selectedRide.driver && (
          <View className="px-6 py-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Motorista e Veículo
            </Text>

            <View className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-1 overflow-hidden">
              {/* Driver Header */}
              <View className="flex-row items-center justify-between p-3 pb-3">
                <View className="flex-row items-center flex-1">
                  {selectedRide.driver.photo ? (
                    <Image
                      source={{ uri: selectedRide.driver.photo }}
                      className="w-14 h-14 rounded-full bg-gray-100 border-2 border-white shadow-sm"
                    />
                  ) : (
                    <View className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center border-2 border-white shadow-sm">
                      <User size={24} color="#94A3B8" />
                    </View>
                  )}
                  <View className="ml-3 flex-1">
                    <Text className="text-lg font-extrabold text-gray-900 mb-0.5">
                      {selectedRide.driver.name}
                    </Text>
                    <View className="flex-row items-center">
                      <View className="bg-gray-50 flex-row items-center px-2 py-1 rounded-md">
                        <Star size={12} color="#F59E0B" fill="#F59E0B" />
                        <Text className="text-xs font-bold text-gray-700 ml-1">
                          {selectedRide.driver.rating || '5.0'}
                        </Text>
                      </View>
                      <View className="w-1 h-1 bg-gray-300 rounded-full mx-2" />
                      <Text className="text-xs text-green-600 font-semibold flex-row items-center">
                        <ShieldCheck size={12} color="#16A34A" /> Verificado
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Call Button */}
                <TouchableOpacity
                  onPress={handleCallDriver}
                  className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center border border-blue-100"
                  activeOpacity={0.7}
                >
                  <Phone size={20} color="#2563EB" />
                </TouchableOpacity>
              </View>

              <View className="h-[1px] bg-gray-100 mx-4" />

              {/* Vehicle Sub-card */}
              {selectedRide.driver.vehicle ? (
                <View className="p-4 flex-row items-center bg-gray-50/50 m-1 rounded-2xl">
                  <View className="w-12 h-12 bg-white shadow-sm border border-gray-100 rounded-xl items-center justify-center mr-3">
                    <VehicleIcon type={selectedRide.driver.vehicle.type} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-sm font-bold text-gray-900 mr-2">
                        {selectedRide.driver.vehicle.brand}{' '}
                        {selectedRide.driver.vehicle.model}
                      </Text>
                      {selectedRide.driver.vehicle.color && (
                        <View
                          className="w-2.5 h-2.5 rounded-full border border-gray-200 shadow-sm"
                          style={{
                            backgroundColor:
                              selectedRide.driver.vehicle.color.toLowerCase()
                          }}
                        />
                      )}
                    </View>
                    <View className="items-start mt-1">
                      <View className="bg-slate-200/80 px-2 py-1 rounded border border-slate-300">
                        <Text className="text-slate-800 font-extrabold text-[11px] tracking-widest uppercase">
                          {selectedRide.driver.vehicle.plate || 'SEM PLACA'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <View className="p-4 flex-row items-center justify-center">
                  <Text className="text-xs font-medium text-gray-400">
                    Detalhes do veículo indisponíveis
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
})

export default memo(RideDetailsSheetModal)
