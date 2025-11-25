// src/screens/Ride/components/RideStatusArrivedDestination.tsx
import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import {
  Package,
  User,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react-native'

interface PackageInfo {
  type?: string
  description?: string
  size?: string
}

interface RideStatusArrivedDestinationProps {
  customerName?: string
  packageInfo?: PackageInfo
}

export const RideStatusArrivedDestination: React.FC<
  RideStatusArrivedDestinationProps
> = ({ customerName, packageInfo }) => {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <View className="absolute top-safe left-4 right-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">
            🎯 Chegou ao Destino
          </Text>
        </View>
      </View>

      {/* Informações Essenciais */}
      <View className="space-y-2 mb-3">
        {customerName && (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <User size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-2">Destinatário</Text>
            </View>
            <Text className="text-gray-900 font-semibold">{customerName}</Text>
          </View>
        )}

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Package size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Status</Text>
          </View>
          <Text className="text-green-600 font-semibold">
            Pronto para entrega
          </Text>
        </View>
      </View>

      {/* Botão para Detalhes */}
      <TouchableOpacity
        className="flex-row items-center justify-between bg-gray-50 p-3 rounded-lg mb-3"
        onPress={() => setShowDetails(!showDetails)}
      >
        <Text className="text-gray-700 font-medium">
          {showDetails ? 'Ocultar detalhes' : 'Ver detalhes da entrega'}
        </Text>
        {showDetails ? (
          <ChevronUp size={16} color="#6B7280" />
        ) : (
          <ChevronDown size={16} color="#6B7280" />
        )}
      </TouchableOpacity>

      {/* Detalhes Expandíveis */}
      {showDetails && (
        <View className="space-y-3 mb-4">
          {/* Detalhes do Pacote */}
          {packageInfo && (
            <View className="bg-blue-50 p-3 rounded-lg">
              <Text className="text-gray-800 font-semibold text-sm mb-2">
                📦 Para Entregar
              </Text>
              <View className="space-y-1">
                {packageInfo.description && (
                  <Text className="text-gray-700 text-sm">
                    {packageInfo.description}
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
              </View>
            </View>
          )}

          {/* Checklist de Entrega */}
          {/* <View className="bg-green-50 p-3 rounded-lg">
            <Text className="text-green-800 font-semibold text-sm mb-2">
              ✅ Processo de Entrega
            </Text>
            <View className="space-y-1">
              <Text className="text-green-700 text-sm">
                • Motorista no local de entrega
              </Text>
              <Text className="text-green-700 text-sm">
                • Aguardando destinatário
              </Text>
              <Text className="text-green-700 text-sm">
                • Entrega pessoal programada
              </Text>
              <Text className="text-green-700 text-sm">
                • Confirmação pendente
              </Text>
            </View>
          </View> */}
        </View>
      )}

      {/* Status Final */}
      <View className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
        <View className="flex-row items-center justify-center">
          <CheckCircle size={16} color="#D97706" />
          <View className="flex-col items-center justify-start flex-1">
            <Text className="text-yellow-800 text-sm ml-2 text-center flex-1">
              O motorista chegou no local de entrega.
            </Text>
            <Text className="text-yellow-800 text-sm font-bold flex-1">
              Forneça o cod. de confirmação (OTP)
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
