// src/screens/Ride/components/DriverStatusOverlay.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Clock, User, Navigation, Shield } from 'lucide-react-native';

interface DriverStatusOverlayProps {
  duration: string;
  driverName: string;
  estimatedTime?: string;
  vehicleInfo?: string;
}

export const DriverStatusOverlay: React.FC<DriverStatusOverlayProps> = ({
  duration,
  driverName,
  estimatedTime,
  vehicleInfo,
}) => {
  return (
    <View className="absolute top-4 left-4 right-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-bold text-gray-900">
          Motorista a Caminho
        </Text>
      </View>

      {/* Informações do motorista */}
      {/* <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
          <User size={20} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-gray-900 font-semibold">{driverName}</Text>
          <Text className="text-gray-600 text-sm">Estafeta</Text>
          {vehicleInfo && (
            <Text className="text-gray-500 text-xs mt-1">{vehicleInfo}</Text>
          )}
        </View>
      </View> */}

      {/* Tempo e status */}
      <View className="space-y-2 mb-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Clock size={16} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-2">
              Chega em aproximadamente
            </Text>
          </View>
          <Text className="text-sm text-gray-900 font-semibold">
            {duration}
          </Text>
        </View>

        {estimatedTime && (
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Previsão de chegada</Text>
            <Text className="text-gray-900 font-semibold">{estimatedTime}</Text>
          </View>
        )}
      </View>

      {/* Status de rastreamento */}
      {/* <View className="bg-green-50 p-3 rounded-lg mb-4">
        <View className="flex-row items-center">
          <Navigation size={16} color="#059669" />
          <Text className="text-green-800 text-sm ml-2 font-medium">
            Rastreamento ativo
          </Text>
        </View>
        <Text className="text-green-700 text-xs mt-1">
          Você pode acompanhar a localização do motorista em tempo real
        </Text>
      </View> */}

      {/* Informações de segurança */}
      {/* <View className="flex-row items-center bg-blue-50 p-2 rounded-lg">
        <Shield size={14} color="#1D4ED8" />
        <Text className="text-blue-700 text-xs ml-2 flex-1">
          Seu pedido está seguro. Motorista verificado e com histórico de
          entregas.
        </Text>
      </View> */}
    </View>
  );
};
