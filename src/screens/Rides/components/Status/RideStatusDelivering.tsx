// src/screens/Ride/components/RideStatusDelivering.tsx
import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import {
  Clock,
  User,
  Package,
  MapPin,
  ChevronDown,
  ChevronUp,
  Navigation
} from 'lucide-react-native'

interface PackageInfo {
  type?: string
  description?: string
  size?: string
  quantity?: number
}

interface RideStatusDeliveringProps {
  distanceTraveled: string
  distanceTotal: string
  duration: string
  packageInfo?: PackageInfo
  customerName?: string
}

export const RideStatusDelivering: React.FC<RideStatusDeliveringProps> = ({
  distanceTraveled,
  distanceTotal,
  duration,
  packageInfo,
  customerName
}) => {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <View className="absolute top-safe left-4 right-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
      {/* Header with live indicator */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View className="w-9 h-9 bg-green-500 rounded-xl items-center justify-center mr-3">
            <Navigation size={18} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-900">
              Em entrega
            </Text>
            <Text className="text-gray-400 text-xs">
              A caminho do destinatário
            </Text>
          </View>
        </View>
        <View className="flex-row items-center bg-green-50 px-2.5 py-1 rounded-full">
          <View className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5" />
          <Text className="text-green-700 text-xs font-medium">Ao vivo</Text>
        </View>
      </View>

      {/* Stats row */}
      <View className="flex-row bg-gray-50 rounded-xl p-3 mb-3 gap-3">
        {/* Duration */}
        <View className="flex-1 items-center">
          <View className="flex-row items-center mb-1">
            <Clock size={12} color="#9ca3af" />
            <Text className="text-gray-400 text-[11px] ml-1">Previsão</Text>
          </View>
          <Text className="text-gray-900 text-sm font-bold">{duration}</Text>
        </View>

        {/* Divider */}
        <View className="w-px bg-gray-200" />

        {/* Distance */}
        <View className="flex-1 items-center">
          <View className="flex-row items-center mb-1">
            <MapPin size={12} color="#9ca3af" />
            <Text className="text-gray-400 text-[11px] ml-1">Distância</Text>
          </View>
          <Text className="text-gray-900 text-sm font-bold">
            {distanceTotal} km
          </Text>
        </View>

        {/* Divider */}
        {customerName && (
          <>
            <View className="w-px bg-gray-200" />
            <View className="flex-1 items-center">
              <View className="flex-row items-center mb-1">
                <User size={12} color="#9ca3af" />
                <Text className="text-gray-400 text-[11px] ml-1">
                  Destino
                </Text>
              </View>
              <Text
                className="text-gray-900 text-sm font-bold"
                numberOfLines={1}
              >
                {customerName}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Expandable package details */}
      {packageInfo && (
        <>
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            onPress={() => setShowDetails(!showDetails)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Package size={14} color="#6b7280" />
              <Text className="text-gray-600 text-sm font-medium ml-2">
                Detalhes do pacote
              </Text>
            </View>
            {showDetails ? (
              <ChevronUp size={16} color="#9ca3af" />
            ) : (
              <ChevronDown size={16} color="#9ca3af" />
            )}
          </TouchableOpacity>

          {showDetails && (
            <View className="bg-gray-50 rounded-xl p-3 mt-1 gap-2">
              {packageInfo.type && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-400 text-sm">Tipo</Text>
                  <Text className="text-gray-800 text-sm font-medium">
                    {packageInfo.type}
                  </Text>
                </View>
              )}
              {packageInfo.description && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-400 text-sm">Descrição</Text>
                  <Text
                    className="text-gray-800 text-sm font-medium flex-1 text-right ml-4"
                    numberOfLines={2}
                  >
                    {packageInfo.description}
                  </Text>
                </View>
              )}
              {packageInfo.size && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-400 text-sm">Tamanho</Text>
                  <Text className="text-gray-800 text-sm font-medium">
                    {packageInfo.size}
                  </Text>
                </View>
              )}
              {packageInfo.quantity && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-400 text-sm">Quantidade</Text>
                  <Text className="text-gray-800 text-sm font-medium">
                    {packageInfo.quantity}
                  </Text>
                </View>
              )}
            </View>
          )}
        </>
      )}
    </View>
  )
}
