// src/screens/Ride/components/ArrivalConfirmationModal.tsx
import React from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import { MapPin, X } from 'lucide-react-native'

interface ArrivalConfirmationModalProps {
  visible: boolean
  onClose: () => void
  locationType: 'pickup' | 'dropoff'
  address: string
  isLoading?: boolean
}

export const ArrivalConfirmationModal: React.FC<
  ArrivalConfirmationModalProps
> = ({ visible, onClose, locationType, address, isLoading = false }) => {
  const isPickup = locationType === 'pickup'

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white rounded-2xl w-full max-w-sm">
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-800">
              {isPickup
                ? 'Chegou ao Local de Recolha?'
                : 'Chegou ao Local de Entrega?'}
            </Text>
            <TouchableOpacity onPress={onClose} disabled={isLoading}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="p-4">
            <View className="items-center mb-4">
              <MapPin size={48} color="#10B981" />
            </View>

            <Text className="text-gray-600 text-center mb-2">
              Confirme que você chegou ao local{' '}
              {isPickup ? 'de recolha' : 'de entrega'}:
            </Text>

            <View className="bg-gray-50 p-3 rounded-lg mb-4">
              <Text className="text-gray-700 text-sm text-center font-medium">
                {address}
              </Text>
            </View>

            <Text className="text-gray-500 text-xs text-center">
              {isPickup
                ? 'Após confirmar, você poderá recolher o pacote do cliente.'
                : 'Após confirmar, você poderá entregar o pacote ao destinatário.'}
            </Text>
          </View>

          {/* Botões */}
          <View className="flex-row p-4 border-t border-gray-200 gap-2">
            <TouchableOpacity
              className="flex-1 bg-gray-100 py-3 rounded-lg mr-2"
              onPress={onClose}
              disabled={isLoading}
            >
              <Text className="text-gray-700 font-semibold text-center">
                Ainda Não
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
