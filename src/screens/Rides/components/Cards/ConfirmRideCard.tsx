// src/screens/Ride/components/ConfirmRideCard.tsx
import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Clock, MapPin, Route } from 'lucide-react-native'

interface ConfirmRideCardProps {
  price: string
  duration: string
  distance: string
  isLoading: boolean
  onConfirm: () => void
  onCancel?: () => void
}

export const ConfirmRideCard: React.FC<ConfirmRideCardProps> = ({
  price,
  duration,
  distance,
  isLoading,
  onConfirm,
  onCancel
}) => {
  return (
    <View className="absolute bottom-safe left-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-100">
      {/* Header */}
      <View className="p-4 border-b border-gray-100">
        <Text className="text-lg font-bold text-gray-900 text-center">
          Confirmar Pedido de Entrega
        </Text>
      </View>

      {/* Detalhes */}
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Route size={20} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Distância total</Text>
          </View>
          <Text className="text-gray-900 font-semibold">{distance}</Text>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Clock size={20} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Tempo estimado</Text>
          </View>
          <Text className="text-gray-900 font-semibold">{duration}</Text>
        </View>

        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <MapPin size={20} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Valor total</Text>
          </View>
          <Text className="text-2xl font-bold text-green-600">{price}</Text>
        </View>

        {/* Botões */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 bg-gray-100 py-4 rounded-xl"
            onPress={onCancel}
            disabled={isLoading}
          >
            <Text className="text-gray-700 font-semibold text-center">
              Voltar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-primary-200 py-4 rounded-xl flex-row items-center justify-center"
            onPress={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text className="text-white font-semibold text-center">
                  Confirmar
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Informação adicional */}
        <Text className="text-gray-500 text-xs text-center mt-3">
          Ao confirmar, você concorda com nossos termos de serviço
        </Text>
      </View>
    </View>
  )
}
