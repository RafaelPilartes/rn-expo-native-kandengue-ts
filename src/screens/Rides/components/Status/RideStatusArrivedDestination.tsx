// src/screens/Ride/components/RideStatusArrivedDestination.tsx
import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import {
  Package,
  User,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck
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
    <View className="absolute top-safe left-4 right-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <View className="w-9 h-9 bg-teal-500 rounded-xl items-center justify-center mr-3">
          <CheckCircle size={18} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900">
            Chegou ao destino
          </Text>
          <Text className="text-gray-400 text-xs">
            Aguardando confirmação da entrega
          </Text>
        </View>
      </View>

      {/* Info stats */}
      <View className="bg-gray-50 rounded-xl p-3 gap-2 mb-3">
        {customerName && (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <User size={14} color="#6b7280" />
              <Text className="text-gray-500 text-sm ml-2">Destinatário</Text>
            </View>
            <Text className="text-gray-900 text-sm font-medium">
              {customerName}
            </Text>
          </View>
        )}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Package size={14} color="#6b7280" />
            <Text className="text-gray-500 text-sm ml-2">Status</Text>
          </View>
          <Text className="text-green-600 text-sm font-semibold">
            Pronto para entrega
          </Text>
        </View>
      </View>

      {/* Expandable package details */}
      {packageInfo && (
        <>
          <TouchableOpacity
            className="flex-row items-center justify-between py-2 mb-2"
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
            <View className="bg-gray-50 rounded-xl p-3 mb-3 gap-2">
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
            </View>
          )}
        </>
      )}

      {/* OTP instruction */}
      <View className="flex-row items-center bg-amber-50 rounded-xl px-3 py-3 border border-amber-100">
        <ShieldCheck size={16} color="#d97706" />
        <View className="flex-1 ml-2.5">
          <Text className="text-amber-800 text-sm">
            Forneça o código de verificação
          </Text>
          <Text className="text-amber-900 text-xs font-bold mt-0.5">
            (OTP) ao motorista para confirmar
          </Text>
        </View>
      </View>
    </View>
  )
}
