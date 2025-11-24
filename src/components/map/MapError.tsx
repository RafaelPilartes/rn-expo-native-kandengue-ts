// src/screens/Map/components/MapError.tsx
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import MapView from 'react-native-maps'
import { BackButton } from '@/components/ui/button/BackButton'

interface MapErrorProps {
  error: string
  onRetry: () => void
  onGoBack: () => void
}

export const MapError: React.FC<MapErrorProps> = ({
  error,
  onRetry,
  onGoBack
}) => {
  return (
    <View className="flex-1 bg-white">
      {/* Mapa de fundo (estático) */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -8.839987,
          longitude: 13.289437,
          latitudeDelta: 0.06,
          longitudeDelta: 0.01
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      />

      {/* Overlay de erro */}
      <View className="absolute bottom-0 left-0 right-0">
        <View className="flex-row items-center ml-4 mb-4">
          <BackButton
            onPress={onGoBack}
            className="bg-white mr-3"
            iconColor="black"
          />
        </View>

        <View className="bg-white p-6 rounded-t-3xl shadow-lg">
          <Text className="text-lg font-bold text-gray-900 mb-2 text-center">
            Ocorreu um erro
          </Text>
          <Text className="text-red-500 text-center mb-6 text-base">
            {error}
          </Text>

          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 bg-red-500 py-4 rounded-full items-center"
              onPress={onRetry}
            >
              <Text className="text-white font-semibold">Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}
