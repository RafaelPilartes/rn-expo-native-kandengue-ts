// src/screens/Rides/components/Status/DriverStatusOverlay.tsx
import React from 'react'
import { View, Text } from 'react-native'
import { Clock, Navigation, MapPin } from 'lucide-react-native'

interface DriverStatusOverlayProps {
  duration: string
  driverName: string
  estimatedTime?: string
  vehicleInfo?: string
}

export const DriverStatusOverlay: React.FC<DriverStatusOverlayProps> = ({
  duration,
  driverName,
  estimatedTime,
  vehicleInfo
}) => {
  return (
    <View
      className="absolute top-safe left-4 right-4 z-50 bg-white rounded-md p-4 border border-gray-100"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8
      }}
    >
      {/* Live Status Header */}
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-blue-500 mr-2 shadow-sm shadow-blue-400" />
          <Text className="text-[11px] font-bold text-blue-500 uppercase tracking-widest">
            Motorista a Caminho
          </Text>
        </View>
      </View>

      {/* Main Info Section */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Motorista chega em
          </Text>
          <View className="flex-row">
            <Clock size={16} color="#6b7280" strokeWidth={2.5} />
            <Text className="text-base font-bold text-gray-800 ml-1.5">
              {estimatedTime || '--:--'}
            </Text>
          </View>
        </View>

        <View className="h-10 w-px bg-gray-100 mx-4" />

        <View className="flex-1 items-end">
          <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Duração da Viagem
          </Text>
          <View className="flex-row items-baseline">
            <Text className="text-3xl font-bold text-gray-900 leading-none">
              {duration.split(' ')[0]}
            </Text>
            <Text className="text-sm font-bold text-gray-500 ml-1">min</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
