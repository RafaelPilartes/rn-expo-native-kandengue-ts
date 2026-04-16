// src/screens/Ride/components/DriverRideCard.tsx
import { RideStatusType } from '@/types/enum'
import { CustomPlace } from '@/types/places'
import {
  MapPinned,
  MessageCircle,
  Phone,
  X,
  Star,
  Bike,
  Car,
  Truck
} from 'lucide-react-native'
import React, { forwardRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking
} from 'react-native'
import { useAlert } from '@/context/AlertContext'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { RideInterface } from '@/interfaces/IRide'
import { formatMoney } from '@/utils/formattedNumber'
import { RideFareInterface } from '@/interfaces/IRideFare'

type Props = {
  rideData: RideInterface
  rideStatus: RideStatusType
  distance: string
  fareDetails: RideFareInterface | null
  onCancel: () => void
  onChange?: (index: number) => void
  snapPoints: (string | number)[]
}

const VEHICLE_COLOR_MAP: Record<string, string> = {
  preto: '#1f2937',
  branco: '#f9fafb',
  prata: '#9ca3af',
  cinza: '#6b7280',
  cinzento: '#6b7280',
  vermelho: '#ef4444',
  azul: '#3b82f6',
  amarelo: '#eab308',
  verde: '#22c55e',
  laranja: '#f97316',
  dourado: '#d97706',
  castanho: '#92400e',
  bege: '#d4a373',
  rosa: '#ec4899',
  roxo: '#8b5cf6'
}

const getColorHex = (colorName?: string): string => {
  if (!colorName) return '#6b7280'
  const normalized = colorName.toLowerCase().trim()
  return VEHICLE_COLOR_MAP[normalized] || '#6b7280'
}

const VehicleIcon = ({ type }: { type?: string }) => {
  switch (type) {
    case 'motorcycle':
    case 'scooter':
    case 'bicycle':
      return <Bike size={16} color="#6b7280" />
    case 'truck':
      return <Truck size={16} color="#6b7280" />
    default:
      return <Car size={16} color="#6b7280" />
  }
}

export const DriverRideSheet = forwardRef<BottomSheetModal, Props>(
  (
    { rideData, fareDetails, rideStatus, distance, onCancel, snapPoints },
    ref
  ) => {
    const { showAlert } = useAlert()

    const driver = rideData.driver
    const vehicle = driver?.vehicle

    const handleCall = () => {
      if (driver?.phone) {
        showAlert(
          'Ligar para entregador',
          `Deseja ligar para ${driver.phone}?`,
          'info',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Ligar',
              onPress: () => Linking.openURL(`tel:${driver.phone}`)
            }
          ]
        )
      } else {
        showAlert('Info', 'Número do entregador não disponível', 'info')
      }
    }

    const handleMessage = () => {
      if (driver?.phone) {
        showAlert(
          'Enviar mensagem',
          `Deseja enviar mensagem para ${driver.phone}?`,
          'info',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Enviar',
              onPress: () => Linking.openURL(`sms:${driver.phone}`)
            }
          ]
        )
      } else {
        showAlert('Info', 'Número do entregador não disponível', 'info')
      }
    }

    const getStatusInfo = () => {
      switch (rideStatus) {
        case 'driver_on_the_way':
          return {
            label: 'A caminho da recolha',
            color: 'bg-blue-100',
            textColor: 'text-blue-700',
            description: 'Entregador está a caminho do local de recolha'
          }
        case 'arrived_pickup':
          return {
            label: 'No local de recolha',
            color: 'bg-green-100',
            textColor: 'text-green-700',
            description: 'Entregador chegou no local de recolha'
          }
        case 'picked_up':
          return {
            label: 'Pacote recolhido',
            color: 'bg-orange-100',
            textColor: 'text-orange-700',
            description: 'Pacote foi recolhido e está a caminho do destino'
          }
        case 'arrived_dropoff':
          return {
            label: 'No local de entrega',
            color: 'bg-teal-100',
            textColor: 'text-teal-700',
            description: 'Entregador chegou no local de entrega'
          }
        default:
          return {
            label: 'Em andamento',
            color: 'bg-gray-100',
            textColor: 'text-gray-700',
            description: 'Entrega em progresso'
          }
      }
    }

    const statusInfo = getStatusInfo()

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        backgroundStyle={{ borderRadius: 24 }}
        handleIndicatorStyle={{ backgroundColor: '#D1D5DB' }}
      >
        <BottomSheetView style={styles.container}>
          {/* Header com status */}
          <View className="flex-row items-center justify-between mb-2">
            <View className={`px-3 py-1 rounded-full ${statusInfo.color}`}>
              <Text className={`text-xs font-medium ${statusInfo.textColor}`}>
                {statusInfo.label}
              </Text>
            </View>
            <Text className="text-gray-400 text-xs font-mono">
              #{rideData.id}
            </Text>
          </View>

          {/* Descrição do status + OTP */}
          <Text className="text-gray-500 text-sm mb-4">
            {statusInfo.description}
          </Text>

          {rideData.otp_code && (
            <View className="flex-row items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-4">
              <Text className="text-gray-500 text-sm">
                Código de verificação
              </Text>
              <View className="flex-row gap-1.5">
                {String(rideData.otp_code)
                  .split('')
                  .map((digit, i) => (
                    <View
                      key={i}
                      className="w-8 h-9 bg-white rounded-lg border border-gray-200 items-center justify-center"
                    >
                      <Text className="text-gray-900 text-base font-bold">
                        {digit}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          )}

          {/* Informações do entregador + veículo */}
          {driver && (
            <View className="mb-4 pb-4 border-b border-gray-100">
              {/* Driver row */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <Image
                    source={{
                      uri:
                        driver.photo ||
                        'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                    }}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 text-base">
                      {driver.name}
                    </Text>
                    {driver.rating != null && (
                      <View className="flex-row items-center mt-0.5">
                        <Star size={13} color="#F59E0B" fill="#F59E0B" />
                        <Text className="text-gray-600 text-sm ml-1">
                          {driver.rating.toFixed(1)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Botões de contato */}
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className="w-10 h-10 rounded-full bg-green-500 items-center justify-center"
                    onPress={handleCall}
                  >
                    <Phone color="white" size={18} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center"
                    onPress={handleMessage}
                  >
                    <MessageCircle color="white" size={18} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Vehicle info */}
              {vehicle && (
                <View className="bg-gray-50 rounded-xl px-3 py-2.5 flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <VehicleIcon type={vehicle.type} />
                    <Text className="text-gray-800 font-medium text-sm ml-2">
                      {vehicle.brand} {vehicle.model}
                    </Text>
                    <View
                      className="w-3 h-3 rounded-full ml-2 border border-gray-300"
                      style={{ backgroundColor: getColorHex(vehicle.color) }}
                    />
                    <Text className="text-gray-400 text-xs ml-1">
                      {vehicle.color}
                    </Text>
                  </View>
                  <View className="bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                    <Text className="text-gray-900 font-bold text-sm tracking-wider">
                      {vehicle.plate}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Detalhes da entrega */}
          <View className="mb-4">
            <Text className="font-semibold text-gray-900 mb-3">
              Detalhes da Entrega
            </Text>

            <View className="gap-3">
              {/* Origem */}
              <View className="flex-row items-start">
                <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center mr-3 mt-0.5">
                  <Text className="text-white text-xs font-bold">A</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs">Recolher em</Text>
                  <Text
                    className="text-gray-900 text-sm font-normal"
                    numberOfLines={2}
                  >
                    {rideData.pickup.description}
                  </Text>
                </View>
              </View>

              {/* Destino */}
              <View className="flex-row items-start">
                <View className="w-6 h-6 bg-red-500 rounded-full items-center justify-center mr-3 mt-0.5">
                  <Text className="text-white text-xs font-bold">B</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs">Entregar em</Text>
                  <Text
                    className="text-gray-900 text-sm font-normal"
                    numberOfLines={2}
                  >
                    {rideData.dropoff.description}
                  </Text>
                </View>
              </View>
            </View>

            {/* Distância */}
            <View className="flex-row items-center mt-3">
              <MapPinned size={14} color="#9ca3af" />
              <Text className="text-gray-500 text-sm ml-1.5">Distância:</Text>
              <Text className="text-gray-800 font-semibold text-sm ml-1">
                {distance}
              </Text>
            </View>
          </View>

          {/* Preço e ações */}
          <View className="flex-row items-center justify-between border-t border-gray-100 pt-4 mb-12">
            <View>
              <Text className="text-green-600 text-2xl font-bold">
                Kz {formatMoney(fareDetails?.total || 0, 0)}
              </Text>
              <Text className="text-gray-400 text-xs">Valor total</Text>
            </View>

            {/* Botão de cancelamento (disponível apenas em certos status) */}
            {(rideStatus === 'driver_on_the_way' ||
              rideStatus === 'arrived_pickup') && (
              <TouchableOpacity
                className="flex-row items-center bg-red-50 border border-red-200 px-4 py-2.5 rounded-full"
                onPress={onCancel}
              >
                <X color="#EF4444" size={16} />
                <Text className="text-red-500 font-semibold text-sm ml-1.5">
                  Cancelar
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    padding: 16
  }
})
