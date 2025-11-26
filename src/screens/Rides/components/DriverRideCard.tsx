// src/screens/Ride/components/DriverRideCard.tsx
import { RideStatusType } from '@/types/enum'
import { CustomPlace } from '@/types/places'
import { MapPinned, MessageCircle, Phone, X, Star } from 'lucide-react-native'
import React, { forwardRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Linking
} from 'react-native'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { UserInterface } from '@/interfaces/IUser'
import { RideInterface } from '@/interfaces/IRide'
import { formatMoney } from '@/utils/formattedNumber'

type Props = {
  rideData: RideInterface
  rideStatus: RideStatusType
  distance: string
  onCancel: () => void
  onChange?: (index: number) => void
  snapPoints: (string | number)[]
}

export const DriverRideSheet = forwardRef<BottomSheetModal, Props>(
  ({ rideData, rideStatus, distance, onCancel, snapPoints }, ref) => {
    const handleCall = () => {
      if (rideData.driver?.phone) {
        Alert.alert(
          'Ligar para entregador',
          `Deseja ligar para ${rideData.driver.phone}?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Ligar',
              onPress: () =>
                Linking.openURL(`tel:${rideData?.driver?.phone ?? '------'}`)
            }
          ]
        )
      } else {
        Alert.alert('Info', 'Número do entregador não disponível')
      }
    }

    const handleMessage = () => {
      if (rideData.driver?.phone) {
        Alert.alert(
          'Enviar mensagem',
          `Deseja enviar mensagem para ${rideData.driver.phone}?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Enviar',
              onPress: () =>
                Linking.openURL(`sms:${rideData?.driver?.phone ?? '------'}`)
            }
          ]
        )
      } else {
        Alert.alert('Info', 'Número do entregador não disponível')
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
            color: 'bg-purple-100',
            textColor: 'text-purple-700',
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
            <Text className="text-gray-500 text-sm">#{rideData.id}</Text>
          </View>

          {/* Código OTP */}
          <View className="flex-row items-center justify-start mb-2">
            <Text className="text-gray-500 text-base">Código OTP: </Text>
            <Text className="text-gray-700 text-base font-bold">
              {rideData.otp_code}
            </Text>
          </View>

          {/* Descrição do status */}
          <Text className="text-gray-600 text-sm mb-4">
            {statusInfo.description}
          </Text>

          {/* Informações do entregador */}
          {rideData.driver && (
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <View className="flex-row items-center flex-1">
                <Image
                  source={{
                    uri:
                      rideData.driver.photo ||
                      'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                  }}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 text-lg">
                    {rideData.driver.name}
                  </Text>
                  <View className="flex-row items-center">
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text className="text-gray-600 text-sm ml-1">
                      4.8 • 250 entregas
                    </Text>
                  </View>
                </View>
              </View>

              {/* Botões de contato */}
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="p-2 rounded-full bg-green-500"
                  onPress={handleCall}
                >
                  <Phone color="white" size={18} />
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-2 rounded-full bg-blue-500"
                  onPress={handleMessage}
                >
                  <MessageCircle color="white" size={18} />
                </TouchableOpacity>
              </View>
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
                  <Text className="text-gray-500 text-sm">Recolher em</Text>
                  <Text className="text-gray-900 font-medium" numberOfLines={2}>
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
                  <Text className="text-gray-500 text-sm">Entregar em</Text>
                  <Text className="text-gray-900 font-medium" numberOfLines={2}>
                    {rideData.dropoff.description}
                  </Text>
                </View>
              </View>
            </View>

            {/* Distância */}
            <View className="flex-row items-center mt-3">
              <MapPinned size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-2">Distância total:</Text>
              <Text className="text-gray-900 font-semibold ml-1">
                {distance}
              </Text>
            </View>
          </View>

          {/* Preço e ações */}
          <View className="flex-row items-center justify-between border-t border-gray-200 pt-4 mb-12">
            <View>
              <Text className="text-green-600 text-2xl font-bold">
                Kz {formatMoney(rideData.fare.total, 0)}
              </Text>
              <Text className="text-gray-600 text-sm">Valor total</Text>
            </View>

            {/* Botão de cancelamento (disponível apenas em certos status) */}
            {(rideStatus === 'driver_on_the_way' ||
              rideStatus === 'arrived_pickup') && (
              <TouchableOpacity
                className="flex-row items-center bg-red-50 border border-red-500 px-4 py-2 rounded-full"
                onPress={onCancel}
              >
                <X color="#EF4444" size={18} />
                <Text className="text-red-600 font-semibold ml-2">
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
