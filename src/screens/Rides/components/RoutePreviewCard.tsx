// src/screens/Ride/components/RoutePreviewCard.tsx
import React from 'react'
import { View, Text } from 'react-native'

interface RoutePreviewCardProps {
  pickupDescription: string
  dropoffDescription: string
}

export const RoutePreviewCard: React.FC<RoutePreviewCardProps> = ({
  pickupDescription,
  dropoffDescription
}) => {
  return (
    <View className="absolute top-4 left-4 right-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
      <Text className="text-lg font-bold text-gray-900 mb-3">
        Resumo do Percurso
      </Text>

      <View className="space-y-3">
        {/* Origem */}
        <View className="flex-row items-start">
          <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center mr-3 mt-0.5">
            <Text className="text-white text-xs font-bold">A</Text>
          </View>
          <View className="flex-1">
            <Text className="text-gray-500 text-sm">Origem</Text>
            <Text className="text-gray-900 font-medium" numberOfLines={2}>
              {pickupDescription}
            </Text>
          </View>
        </View>

        {/* Destino */}
        <View className="flex-row items-start">
          <View className="w-6 h-6 bg-red-500 rounded-full items-center justify-center mr-3 mt-0.5">
            <Text className="text-white text-xs font-bold">B</Text>
          </View>
          <View className="flex-1">
            <Text className="text-gray-500 text-sm">Destino</Text>
            <Text className="text-gray-900 font-medium" numberOfLines={2}>
              {dropoffDescription}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
