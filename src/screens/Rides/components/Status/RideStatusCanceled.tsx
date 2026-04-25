import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { XCircle } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'

interface RideStatusCanceledProps {
  onAutoNavigate?: () => void
}

const AUTO_NAVIGATE_DELAY_MS = 3000

export const RideStatusCanceled: React.FC<RideStatusCanceledProps> = ({
  onAutoNavigate
}) => {
  const navigation = useNavigation()

  // Auto-navigate back after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onAutoNavigate) {
        onAutoNavigate()
      } else if (navigation.canGoBack()) {
        navigation.goBack()
      }
    }, AUTO_NAVIGATE_DELAY_MS)

    return () => clearTimeout(timer)
  }, [onAutoNavigate, navigation])

  return (
    <View className="absolute top-safe left-4 right-4 bg-white rounded-2xl shadow-lg border border-red-200 p-5">
      <View className="items-center mb-3">
        <View className="w-14 h-14 bg-red-50 rounded-full items-center justify-center mb-3">
          <XCircle size={28} color="#EF4444" />
        </View>
        <Text className="text-lg font-bold text-red-600 text-center mb-1">
          Corrida Cancelada
        </Text>
        <Text className="text-gray-500 text-sm text-center">
          Esta corrida foi cancelada. Você será redirecionado automaticamente.
        </Text>
      </View>

      {/* Progress indicator */}
      <View className="h-1 bg-gray-100 rounded-full overflow-hidden mt-2">
        <View
          className="h-full bg-red-400 rounded-full"
          style={{ width: '100%' }}
        />
      </View>
    </View>
  )
}
