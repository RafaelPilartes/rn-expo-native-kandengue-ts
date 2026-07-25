// src/screens/Ride/components/ConfirmRideCard.tsx
import React, { useEffect, useRef } from 'react'
import {
  Animated,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Clock, MapPin, Route } from 'lucide-react-native'

interface ConfirmRideCardProps {
  price: string
  duration: string
  distance: string
  isLoading: boolean
  onConfirm: () => void
  onCancel?: () => void
  /** Slot opcional para inserir o componente de código promocional. */
  promoSlot?: React.ReactNode
  /** Linha de desconto aplicada — exibida acima do total quando há desconto. */
  discountLabel?: string
  finalPrice?: string
}

export const ConfirmRideCard: React.FC<ConfirmRideCardProps> = ({
  price,
  duration,
  distance,
  isLoading,
  onConfirm,
  onCancel,
  promoSlot,
  discountLabel,
  finalPrice
}) => {
  const { bottom: safeBottom } = useSafeAreaInsets()
  const bottomAnim = useRef(new Animated.Value(safeBottom)).current

  useEffect(() => {
    bottomAnim.setValue(safeBottom)
  }, [safeBottom, bottomAnim])

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const onShow = Keyboard.addListener(showEvent, e => {
      Animated.timing(bottomAnim, {
        toValue: e.endCoordinates.height + 8,
        duration: Platform.OS === 'ios' ? e.duration : 220,
        useNativeDriver: false
      }).start()
    })
    const onHide = Keyboard.addListener(hideEvent, e => {
      Animated.timing(bottomAnim, {
        toValue: safeBottom,
        duration: Platform.OS === 'ios' ? e.duration : 220,
        useNativeDriver: false
      }).start()
    })
    return () => {
      onShow.remove()
      onHide.remove()
    }
  }, [safeBottom, bottomAnim])

  return (
    <Animated.View
      className="absolute left-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-100"
      style={{ bottom: bottomAnim }}
    >
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

        {/* Promo code slot */}
        {promoSlot}

        {discountLabel && (
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-500 line-through text-sm">{price}</Text>
            <Text className="text-green-600 font-semibold">
              − {discountLabel}
            </Text>
          </View>
        )}

        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <MapPin size={20} color="#6B7280" />
            <Text className="text-gray-600 ml-2">
              {finalPrice ? 'Total a pagar' : 'Valor total'}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-green-600">
            {finalPrice ?? price}
          </Text>
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
    </Animated.View>
  )
}
