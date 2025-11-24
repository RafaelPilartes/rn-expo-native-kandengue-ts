// src/screens/Ride/components/OTPModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { X, Shield } from 'lucide-react-native';

interface OTPModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (otpCode: string) => void;
  customerName: string;
}

export const OTPModal: React.FC<OTPModalProps> = ({
  visible,
  onClose,
  onConfirm,
  customerName,
}) => {
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (otpCode.length !== 4) {
      Alert.alert('Erro', 'Por favor, digite o código de 4 dígitos');
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(otpCode);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOtpCode('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-gray-600 bg-opacity-50 justify-center items-center p-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Shield size={24} color="#10B981" />
              <Text className="text-lg font-bold ml-2">Confirmar Entrega</Text>
            </View>
            <TouchableOpacity onPress={handleClose} disabled={isLoading}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Instructions */}
          <Text className="text-gray-600 mb-2">
            Peça ao cliente o código de verificação:
          </Text>
          <View className="bg-blue-50 p-3 rounded-lg mb-4">
            <Text className="text-blue-800 text-sm text-center">
              Cliente: <Text className="font-semibold">{customerName}</Text>
            </Text>
          </View>

          {/* OTP Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Código OTP (4 dígitos)
            </Text>
            <TextInput
              value={otpCode}
              onChangeText={setOtpCode}
              placeholder="0000"
              placeholderTextColor="#b1b5bd"
              keyboardType="number-pad"
              maxLength={4}
              className="text-black bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl font-bold"
              editable={!isLoading}
            />
          </View>

          {/* Info */}
          {/* <View className="bg-blue-50 p-3 rounded-lg mb-6">
            <Text className="text-blue-800 text-sm text-center">
              💡 O código foi enviado para o cliente via SMS
            </Text>
          </View> */}

          {/* Buttons */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleClose}
              disabled={isLoading}
              className="flex-1 py-3 border border-gray-300 rounded-lg items-center"
            >
              <Text className="text-gray-700 font-medium">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isLoading || otpCode.length !== 4}
              className="flex-1 bg-green-600 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-medium">
                {isLoading ? 'Verificando...' : 'Confirmar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
