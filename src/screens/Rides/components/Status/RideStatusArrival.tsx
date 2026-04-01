// src/screens/Ride/components/RideStatusArrival.tsx
import React from 'react'
import { View, Text } from 'react-native'
import { MapPin, Clock, AlertTriangle } from 'lucide-react-native'
import { RideStatusType } from '@/types/enum'

interface RideStatusArrivalProps {
  rideStatus: RideStatusType
  currentTime: string
  additionalTime: string
  customerName?: string
}

export const RideStatusArrival: React.FC<RideStatusArrivalProps> = ({
  rideStatus,
  currentTime,
  additionalTime,
  customerName
}) => {
  const isAtPickup = rideStatus === 'arrived_pickup'
  const hasExtraTime = additionalTime && parseInt(additionalTime) > 0

  return (
    <View className="absolute top-safe left-4 right-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <View className="w-9 h-9 bg-blue-500 rounded-xl items-center justify-center mr-3">
          <MapPin size={18} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900">
            {isAtPickup
              ? 'Motorista chegou no local'
              : 'Aguardando confirmação'}
          </Text>
          <Text className="text-gray-400 text-xs">
            {isAtPickup
              ? 'Entregue o pacote ao motorista'
              : 'Motorista aguardando no ponto de recolha'}
          </Text>
        </View>
      </View>

      {/* Wait time stats */}
      <View className="bg-gray-50 rounded-xl p-3 gap-2">
        {/* Timer */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Clock size={14} color="#6b7280" />
            <Text className="text-gray-500 text-sm ml-2">Tempo de espera</Text>
          </View>
          <Text className="text-gray-900 text-sm font-bold">{currentTime}</Text>
        </View>

        {/* Customer */}
        {customerName && (
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-500 text-sm">Destinatário</Text>
            <Text className="text-gray-900 text-sm font-medium">
              {customerName}
            </Text>
          </View>
        )}
      </View>

      {/* Extra time warning */}
      {hasExtraTime && (
        <View className="flex-row items-center bg-orange-50 rounded-xl px-3 py-2.5 mt-3 border border-orange-100">
          <AlertTriangle size={14} color="#f97316" />
          <Text className="text-orange-700 text-sm ml-2 flex-1">
            Tempo adicional de espera:{' '}
            <Text className="font-bold">+{additionalTime} min</Text>
          </Text>
        </View>
      )}
    </View>
  )
}
