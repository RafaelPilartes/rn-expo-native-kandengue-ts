// src/screens/Ride/components/CancelRideModal.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native'
import { useAlert } from '@/context/AlertContext'
import { X } from 'lucide-react-native'

interface CancelRideModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  isLoading?: boolean
}

const CANCEL_REASONS = [
  'Estafeta não apareceu',
  'Localização incorreta',
  'Problema com a encomenda',
  'Emergência pessoal',
  'Estafeta cancelou',
  'Problema com a rota',
  'Outro motivo'
]

export const CancelRideModal: React.FC<CancelRideModalProps> = ({
  visible,
  onClose,
  onConfirm,
  isLoading = false
}) => {
  const { showAlert } = useAlert()
  const [selectedReason, setSelectedReason] = useState('')
  const [customReason, setCustomReason] = useState('')

  const handleConfirm = () => {
    const reason =
      selectedReason === 'Outro motivo' ? customReason : selectedReason
    if (!reason.trim()) {
      showAlert(
        'Atenção',
        'Por favor, selecione ou digite um motivo.',
        'warning'
      )
      return
    }
    onConfirm(reason)
    setSelectedReason('')
    setCustomReason('')
  }

  const handleClose = () => {
    setSelectedReason('')
    setCustomReason('')
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-end mb-safe">
        <View className="bg-white rounded-t-3xl max-h-3/4">
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-800">
              Cancelar Corrida
            </Text>
            <TouchableOpacity onPress={handleClose} disabled={isLoading}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-4">
            <Text className="text-gray-600 mb-4">
              Por favor, selecione o motivo do cancelamento:
            </Text>

            {/* Lista de motivos */}
            {CANCEL_REASONS.map(reason => (
              <TouchableOpacity
                key={reason}
                className={`flex-row items-center p-3 rounded-lg mb-2 border ${
                  selectedReason === reason
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
                onPress={() => setSelectedReason(reason)}
                disabled={isLoading}
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-3 ${
                    selectedReason === reason
                      ? 'bg-red-500 border-red-500'
                      : 'border-gray-400'
                  }`}
                />
                <Text
                  className={`font-medium ${
                    selectedReason === reason ? 'text-red-700' : 'text-gray-700'
                  }`}
                >
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Campo para motivo personalizado */}
            {selectedReason === 'Outro motivo' && (
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg p-3 mt-2 text-gray-700"
                placeholder="Descreva o motivo..."
                value={customReason}
                onChangeText={setCustomReason}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!isLoading}
              />
            )}
          </ScrollView>

          {/* Botões */}
          <View className="flex-row p-4 border-t border-gray-200">
            <TouchableOpacity
              className="flex-1 bg-gray-100 py-3 rounded-lg mr-2"
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text className="text-gray-700 font-semibold text-center">
                Voltar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-red-500 py-3 rounded-lg ml-2"
              onPress={handleConfirm}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-center">
                {isLoading ? 'Cancelando...' : 'Confirmar Cancelamento'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
