// src/screens/Main/History/components/RideDetailsSheetModal.tsx
import React, { forwardRef, useEffect } from 'react'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView
} from '@gorhom/bottom-sheet'
import { View, Text, Image } from 'react-native'
import { Car, Bike, Package, Clock, Route, User } from 'lucide-react-native'
import { RideInterface } from '@/interfaces/IRide'
import { formatMoney } from '@/utils/formattedNumber'
import { formatDate, formatFullDate } from '@/utils/formatDate'

interface RideDetailsSheetModalProps {
  selectedRide: RideInterface | null
  snapPoints: string[]
  onChange: (index: number) => void
}

const RideDetailsSheetModal = forwardRef<
  BottomSheetModal,
  RideDetailsSheetModalProps
>(({ selectedRide, snapPoints, onChange }, ref) => {
  // Obter ícone do tipo
  const getTypeIcon = () => {
    if (!selectedRide) return null

    switch (selectedRide.type) {
      case 'car':
        return <Car size={20} color="#000" />
      case 'motorcycle':
        return <Bike size={20} color="#000" />
      case 'delivery':
        return <Package size={20} color="#000" />
      default:
        return <Car size={20} color="#000" />
    }
  }

  // Traduzir status
  const translateStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      completed: '✅ Concluída',
      canceled: '❌ Cancelada',
      pending: '⏳ Pendente',
      idle: '🟡 Disponível',
      driver_on_the_way: '🚗 A caminho da recolha',
      arrived_pickup: '📍 Chegou ao local de recolha',
      picked_up: '📦 Encomenda recolhida',
      arrived_dropoff: '🏁 Chegou ao destino'
    }

    return statusMap[status] || status
  }

  const earnings = selectedRide
    ? selectedRide.fare?.payouts?.driver_earnings
    : 0
  const totalFare = selectedRide ? selectedRide.fare?.total : 0

  useEffect(() => {
    if (!selectedRide) null
    console.log(
      'selectedRide',
      formatFullDate(selectedRide?.created_at, 'dd MMM yyyy - HH:mm')
    )
  }, [selectedRide])
  return (
    <BottomSheetModal
      ref={ref}
      onChange={onChange}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={{ borderRadius: 24 }}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.2}
        />
      )}
    >
      {selectedRide ? (
        <>
          <BottomSheetScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 45 }}
          >
            {/* Header */}
            <View className="px-4 pt-2 pb-4 mb-safe border-b border-gray-200">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  {getTypeIcon()}
                  <Text className="text-lg font-semibold text-gray-800 ml-2">
                    Corrida #{selectedRide.id?.slice(-6)}
                  </Text>
                </View>
                <Text className="text-gray-500 text-sm">
                  {formatFullDate(selectedRide.created_at)}
                </Text>
              </View>

              <View className="bg-blue-50 px-3 py-2 rounded-lg">
                <Text className="text-blue-800 font-medium">
                  {translateStatus(selectedRide.status)}
                </Text>
              </View>
              <Text className="text-gray-600 font-normal mt-2">
                {selectedRide.cancel_reason}
              </Text>
            </View>

            {/* Rota */}
            <View className="px-4 py-4">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                📍 Rota da Corrida
              </Text>

              <View className="space-y-3">
                <View className="flex-row items-start">
                  <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-3 mt-0.5">
                    <Text className="text-white text-xs font-bold">A</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700">
                      Recolha
                    </Text>
                    <Text className="text-gray-600 mt-1">
                      {selectedRide.pickup?.name || 'Local de recolha'}
                    </Text>
                    {selectedRide.pickup?.description && (
                      <Text className="text-gray-500 text-xs mt-1">
                        {selectedRide.pickup.description}
                      </Text>
                    )}
                  </View>
                </View>

                <View className="flex-row items-start">
                  <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center mr-3 mt-0.5">
                    <Text className="text-white text-xs font-bold">B</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700">
                      Entrega
                    </Text>
                    <Text className="text-gray-600 mt-1">
                      {selectedRide.dropoff?.name || 'Local de entrega'}
                    </Text>
                    {selectedRide.dropoff?.description && (
                      <Text className="text-gray-500 text-xs mt-1">
                        {selectedRide.dropoff.description}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* Estatísticas */}
            <View className="px-4 py-4 border-t border-gray-200">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                📊 Estatísticas
              </Text>

              <View className="flex-row justify-between">
                {selectedRide.distance && (
                  <View className="flex-row items-center">
                    <Route size={20} color="#6B7280" />
                    <View className="ml-2">
                      <Text className="text-gray-500 text-sm">Distância</Text>
                      <Text className="text-gray-800 font-medium">
                        {selectedRide.distance} km
                      </Text>
                    </View>
                  </View>
                )}

                {selectedRide.duration && (
                  <View className="flex-row items-center">
                    <Clock size={20} color="#6B7280" />
                    <View className="ml-2">
                      <Text className="text-gray-500 text-sm">Duração</Text>
                      <Text className="text-gray-800 font-medium">
                        {Math.round(selectedRide.duration / 60)} min
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Informações de Pagamento */}
            <View className="px-4 py-4 border-t border-gray-200">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                💰 Pagamento
              </Text>

              <View className="bg-gray-50 rounded-lg p-3">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-600">Valor total da corrida:</Text>
                  <Text className="text-gray-800 font-medium">
                    Kz {formatMoney(totalFare, 0)}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-600">Seus ganhos:</Text>
                  <Text className="text-green-600 font-bold text-lg">
                    Kz {formatMoney(earnings, 0)}
                  </Text>
                </View>

                {selectedRide.fare?.breakdown && (
                  <View className="mt-2 pt-2 border-t border-gray-200">
                    <Text className="text-gray-500 text-sm mb-1">
                      Detalhamento:
                    </Text>
                    <View className="space-y-1">
                      <View className="flex-row justify-between">
                        <Text className="text-gray-500 text-xs">Base:</Text>
                        <Text className="text-gray-500 text-xs">
                          Kz{' '}
                          {formatMoney(
                            selectedRide.fare.breakdown.base_fare,
                            0
                          )}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-gray-500 text-xs">
                          Distância:
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          Kz{' '}
                          {formatMoney(
                            selectedRide.fare.breakdown.distance_cost,
                            0
                          )}
                        </Text>
                      </View>
                      {selectedRide.fare.breakdown.wait_cost > 0 && (
                        <View className="flex-row justify-between">
                          <Text className="text-gray-500 text-xs">Espera:</Text>
                          <Text className="text-gray-500 text-xs">
                            Kz{' '}
                            {formatMoney(
                              selectedRide.fare.breakdown.wait_cost,
                              0
                            )}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Informações do Cliente (se disponível) */}
            {selectedRide.user && (
              <View className="px-4 py-4 border-t border-gray-200">
                <Text className="text-lg font-semibold text-gray-800 mb-3">
                  👤 Cliente
                </Text>

                <View className="flex-row items-center">
                  {selectedRide.user.photo ? (
                    <Image
                      source={{ uri: selectedRide.user.photo }}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                  ) : (
                    <View className="w-12 h-12 rounded-full bg-gray-300 items-center justify-center mr-3">
                      <User size={20} color="#6B7280" />
                    </View>
                  )}
                  <View>
                    <Text className="font-medium text-gray-800">
                      {selectedRide.user.name || 'Cliente'}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {selectedRide.user.phone || 'Telefone não disponível'}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Detalhes da Entrega (se for delivery) */}
            {selectedRide.type === 'delivery' && selectedRide.details && (
              <View className="px-4 py-4 border-t border-gray-200">
                <Text className="text-lg font-semibold text-gray-800 mb-3">
                  📦 Detalhes da Entrega
                </Text>

                <View className="bg-gray-50 rounded-lg p-3">
                  <View className="mb-2">
                    <Text className="text-gray-700 font-medium">
                      Destinatário
                    </Text>
                    <Text className="text-gray-600">
                      {selectedRide.details.receiver.name}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {selectedRide.details.receiver.phone}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-gray-700 font-medium">Encomenda</Text>
                    <Text className="text-gray-600">
                      {selectedRide.details.item.type} •{' '}
                      {selectedRide.details.item.size}
                    </Text>
                    {selectedRide.details.item.description && (
                      <Text className="text-gray-500 text-sm mt-1">
                        {selectedRide.details.item.description}
                      </Text>
                    )}
                    <Text className="text-gray-500 text-sm mt-1">
                      Quantidade: {selectedRide.details.item.quantity}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </BottomSheetScrollView>
        </>
      ) : (
        <>
          <BottomSheetView style={{ padding: 16, alignItems: 'center' }}>
            <Text className="text-gray-500">Nenhuma corrida selecionada</Text>
          </BottomSheetView>
        </>
      )}
    </BottomSheetModal>
  )
})

export default RideDetailsSheetModal
