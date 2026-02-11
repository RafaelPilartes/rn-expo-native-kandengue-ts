// src/screens/Ride/components/RideStatusDelivering.tsx
import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Clock, User, ChevronDown, ChevronUp } from 'lucide-react-native'

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

  // Calcular progresso aproximado
  const progress = Math.min(100, 50) // Mock - pode ser calculado baseado na distância

  return (
    <View className="absolute top-safe left-4 right-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">🚚 Em Entrega</Text>
          <Text className="text-gray-500 text-sm">
            A caminho do destinatário
          </Text>
        </View>
      </View>

      {/* Informações Essenciais */}
      <View className="gap-2 mb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Clock size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Previsão de entrega</Text>
          </View>
          <Text className="text-gray-900 font-semibold">{duration}</Text>
        </View>

        {customerName && (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <User size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-2">Destinatário</Text>
            </View>
            <Text className="text-gray-900 font-semibold">{customerName}</Text>
          </View>
        )}
      </View>

      {/* Botão para Detalhes */}
      <TouchableOpacity
        className="flex-row items-center justify-between bg-gray-50 p-3 rounded-lg mb-3"
        onPress={() => setShowDetails(!showDetails)}
      >
        <Text className="text-gray-700 font-medium">
          {showDetails ? 'Ocultar detalhes' : 'Ver detalhes do pacote'}
        </Text>
        {showDetails ? (
          <ChevronUp size={16} color="#6B7280" />
        ) : (
          <ChevronDown size={16} color="#6B7280" />
        )}
      </TouchableOpacity>

      {/* Detalhes Expandíveis */}
      {showDetails && (
        <View className="gap-3">
          {/* Informações do Pacote */}
          {packageInfo && (
            <View className="bg-blue-50 p-3 rounded-lg">
              <Text className="text-gray-800 font-semibold text-sm mb-2">
                📦 Detalhes do Pacote
              </Text>
              <View className="gap-1">
                {packageInfo.description && (
                  <Text className="text-gray-700 text-sm">
                    Descrição: {packageInfo.description}
                  </Text>
                )}
                {packageInfo.type && (
                  <Text className="text-gray-700 text-sm">
                    Tipo: {packageInfo.type}
                  </Text>
                )}
                {packageInfo.size && (
                  <Text className="text-gray-700 text-sm">
                    Tamanho: {packageInfo.size}
                  </Text>
                )}
                {packageInfo.quantity && (
                  <Text className="text-gray-700 text-sm">
                    Quantidade: {packageInfo.quantity}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Status Atual */}
      {/* <View className="bg-purple-50 p-3 rounded-lg border border-purple-200">
        <Text className="text-purple-800 text-sm text-center">
          📍 Seu pacote está a caminho do destinatário final. Acompanhe o
          trajeto em tempo real.
        </Text>
      </View> */}
    </View>
  )
}
