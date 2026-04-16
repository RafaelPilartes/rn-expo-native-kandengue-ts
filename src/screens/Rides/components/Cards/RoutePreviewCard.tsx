// src/screens/Rides/components/Cards/RoutePreviewCard.tsx
import React from 'react'
import { View, Text } from 'react-native'
import { MapPin } from 'lucide-react-native'

interface RoutePreviewCardProps {
  pickupDescription: string
  dropoffDescription: string
}

export const RoutePreviewCard: React.FC<RoutePreviewCardProps> = ({
  pickupDescription,
  dropoffDescription
}) => {
  return (
    <View
      className="absolute top-safe left-4 right-4 z-50 bg-white rounded-3xl p-5 border border-gray-100"
      style={{
        shadowColor: '#09090b',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.1,
        shadowRadius: 28,
        elevation: 12
      }}
    >
      {/* Title Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-sm font-bold text-gray-900 tracking-tight">
          Detalhes do Percurso
        </Text>
        <View className="px-2.5 py-1 bg-primary-50 rounded-full">
          <Text className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">
            Entrega
          </Text>
        </View>
      </View>

      <View className="flex-row">
        {/* Visual Timeline Graphics */}
        <View className="items-center mr-4 pt-1 w-6">
          {/* Origin Dot */}
          <View className="w-6 h-6 rounded-full bg-green-50 items-center justify-center border border-green-200">
            <View className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm" />
          </View>

          {/* Solid subtle line instead of dashed for perfect cross-platform rendering */}
          <View className="flex-1 w-[2px] bg-gray-100 my-1 rounded-full" />

          {/* Destination Pin */}
          <View className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center border border-red-200">
            <MapPin size={12} color="#ef4444" strokeWidth={3} />
          </View>
        </View>

        {/* Content Texts */}
        <View className="flex-1">
          {/* Pickup */}
          <View className="mb-4">
            <Text className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">
              Ponto de Recolha
            </Text>
            <Text
              className="font-semibold text-sm text-gray-800 leading-5"
              numberOfLines={2}
            >
              {pickupDescription || 'A obter localização...'}
            </Text>
          </View>

          {/* Dropoff */}
          <View className="pb-1">
            <Text className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">
              Ponto de Entrega
            </Text>
            <Text
              className="font-semibold text-sm text-gray-800 leading-5"
              numberOfLines={2}
            >
              {dropoffDescription || 'A carregar...'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
