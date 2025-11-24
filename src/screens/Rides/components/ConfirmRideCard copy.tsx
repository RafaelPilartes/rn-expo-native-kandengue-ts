// src/screens/Ride/components/ConfirmRideCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Clock, MapPin, AlertTriangle } from 'lucide-react-native';

interface ConfirmRideCardProps {
  price: string;
  duration: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmRideCard: React.FC<ConfirmRideCardProps> = ({
  price,
  duration,
  isLoading,
  onConfirm,
  onCancel,
}) => {
  return (
    <View className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-100">
      {/* Header */}
      <View className="p-4 border-b border-gray-100">
        <Text className="text-lg font-bold text-gray-900 text-center">
          Confirmar Corrida
        </Text>
      </View>

      {/* Detalhes */}
      <View className="p-4">
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
            <Text className="text-gray-600 ml-2">Valor da corrida</Text>
          </View>
          <Text className="text-2xl font-bold text-green-600">{price}</Text>
        </View>

        {/* Aviso */}
        <View className="flex-row items-start bg-yellow-50 p-3 rounded-lg mb-4">
          <AlertTriangle size={16} color="#D97706" className="mt-0.5 mr-2" />
          <Text className="text-yellow-800 text-sm flex-1">
            Ao confirmar, você aceita buscar o pedido no local de recolha.
          </Text>
        </View>

        {/* Botões */}
        <View className="flex-row space-x-3">
          <TouchableOpacity
            className="flex-1 bg-gray-100 py-4 rounded-xl"
            onPress={onCancel}
            disabled={isLoading}
          >
            <Text className="text-gray-700 font-semibold text-center">
              Recusar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-green-500 py-4 rounded-xl flex-row items-center justify-center"
            onPress={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text className="text-white font-semibold text-center mr-2">
                  Aceitar Corrida
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
