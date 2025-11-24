// src/screens/Ride/components/RideStatusArrival.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  User,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { RideStatusType } from '@/types/enum';

interface RideStatusArrivalProps {
  rideStatus: RideStatusType;
  currentTime: string;
  additionalTime: string;
  customerName?: string;
}

export const RideStatusArrival: React.FC<RideStatusArrivalProps> = ({
  rideStatus,
  currentTime,
  additionalTime,
  customerName,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const isAtPickup = rideStatus === 'arrived_pickup';

  return (
    <View className="absolute top-4 left-4 right-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">
            {isAtPickup
              ? '📦 Motorista chegou no local'
              : '🕐 Aguardando confirmação'}
          </Text>
        </View>
      </View>

      {/* Informações Essenciais */}
      <View className="gap-2">
        {/* {customerName && (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <User size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-2">Entregador</Text>
            </View>
            <Text className="text-gray-900 font-semibold">{customerName}</Text>
          </View>
        )} */}

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Clock size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Tempo de espera</Text>
          </View>
          <Text className="text-gray-900 font-semibold">{currentTime}</Text>
        </View>

        {/* Tempo Adicional */}
        {additionalTime && parseInt(additionalTime) > 0 && (
          <View className="bg-orange-50 p-3 rounded-lg">
            <Text className="text-orange-800 text-sm">
              Tempo de espera adicional: +{additionalTime} minutos
            </Text>
          </View>
        )}
      </View>

      {/* Botão para Expandir/Recolher */}
      {/* <TouchableOpacity
        className="flex-row items-center justify-between bg-gray-50 p-3 rounded-lg mb-3"
        onPress={() => setShowDetails(!showDetails)}
      >
        <Text className="text-gray-700 font-medium">
          {showDetails ? 'Ocultar detalhes' : 'Mostrar detalhes'}
        </Text>
        {showDetails ? (
          <ChevronUp size={16} color="#6B7280" />
        ) : (
          <ChevronDown size={16} color="#6B7280" />
        )}
      </TouchableOpacity> */}

      {/* Detalhes Expandíveis */}
      {/* {showDetails && (
        <View className="gap-3 mb-4">
          // Status Atual
          <View className="bg-blue-50 p-3 rounded-lg">
            <Text className="text-blue-800 font-semibold text-sm mb-1">
              Status da Entrega:
            </Text>
            <Text className="text-blue-700 text-sm">
              {isAtPickup
                ? 'O motorista chegou no local de recolha e está aguardando para pegar o pacote.'
                : 'O motorista está a caminho do local de recolha.'}
            </Text>
          </View>

          // Instruções
          <View className="bg-green-50 p-3 rounded-lg">
            <Text className="text-green-800 font-semibold text-sm mb-2">
              {isAtPickup ? 'Próximos Passos:' : 'O que esperar:'}
            </Text>
            {isAtPickup ? (
              <View className="gap-1">
                <Text className="text-green-700 text-sm">
                  • Localize o motorista
                </Text>
                <Text className="text-green-700 text-sm">
                  • Entregue o pacote
                </Text>
                <Text className="text-green-700 text-sm">
                  • Confirme a entrega
                </Text>
              </View>
            ) : (
              <View className="gap-1">
                <Text className="text-green-700 text-sm">
                  • Aguarde no local combinado
                </Text>
                <Text className="text-green-700 text-sm">
                  • Tenha o pacote pronto
                </Text>
                <Text className="text-green-700 text-sm">
                  • Esteja disponível para contato
                </Text>
              </View>
            )}
          </View>
        </View>
      )} */}

      {/* Ação Principal */}
      {/* <View className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
        <Text className="text-yellow-800 text-sm text-center">
          {isAtPickup
            ? '📍 O motorista está no local. Procure pelo veículo/entregador.'
            : '🚗 O motorista está a caminho. Prepare o pacote para a recolha.'}
        </Text>
      </View> */}
    </View>
  );
};
