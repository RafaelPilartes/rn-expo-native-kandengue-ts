// src/components/RideItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  ArrowRight,
  Bike,
  Car,
  Package,
  Clock,
  MapPin,
  User,
  LucideIcon,
} from 'lucide-react-native';
import StatusTag from './StatusTag';
import { RideInterface } from '@/interfaces/IRide';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatFullDate } from '@/utils/formatDate';

type Props = {
  item: RideInterface;
  onPress?: () => void;
};

// Definir a interface para o config de ícones
interface IconConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

// Mapeamento de tipos com tipo seguro
const iconConfig: Record<string, IconConfig> = {
  motorcycle: { icon: Bike, color: '#DC2626', bgColor: 'bg-red-100' },
  car: { icon: Car, color: '#2563EB', bgColor: 'bg-blue-100' },
  delivery: { icon: Package, color: '#059669', bgColor: 'bg-green-100' },
  bicycle: { icon: Bike, color: '#D97706', bgColor: 'bg-amber-100' },
};

// Tipo para as labels
const typeLabels: Record<string, string> = {
  motorcycle: 'Moto',
  car: 'Carro',
  delivery: 'Entrega',
  bicycle: 'Bicicleta',
};

export default function RideItem({ item, onPress }: Props) {
  // Renderizar ícone baseado no tipo de corrida com cores temáticas
  const renderIconeType = () => {
    // Usar type assertion ou fallback seguro
    const rideType = item.type as keyof typeof iconConfig;
    const config = iconConfig[rideType] || iconConfig.car;
    const IconComponent = config.icon;

    return (
      <View className={`p-3 mr-3 bg-slate-100 rounded-full ${config.bgColor}`}>
        <IconComponent size={20} color={config.color} />
      </View>
    );
  };

  // Formatar data da corrida
  const formatRideDate = (date: Date | undefined) => {
    if (!date) return 'Data não disponível';
    return formatFullDate(date, 'dd MMM yyyy - HH:mm');
  };

  // Formatar duração
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins > 0 ? `${mins}min` : ''}`.trim();
    }
  };

  // Formatar distância
  const formatDistance = (km: number) => {
    return `${km} km`;
  };

  // Obter label do tipo de corrida de forma segura
  const getTypeLabel = () => {
    const rideType = item.type as keyof typeof typeLabels;
    return typeLabels[rideType] || 'Carro';
  };

  return (
    <TouchableOpacity
      className="bg-white mx-4 my-2 rounded-2xl shadow-lg border border-gray-100"
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header com tipo e status */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
        <View className="flex-row items-center">
          {renderIconeType()}
          <View className="ml-3">
            <Text className="text-sm font-semibold text-gray-900 capitalize">
              {getTypeLabel()}
            </Text>
            <Text className="text-xs text-gray-500">
              {formatRideDate(item.created_at)}
            </Text>
          </View>
        </View>
        <StatusTag status={item.status} />
      </View>

      {/* Conteúdo principal */}
      <View className="w-full p-4">
        {/* Origem e Destino */}
        <View className="w-full mb-4 flex-col items-start justify-between">
          <View className="flex-row">
            <MapPin size={16} color="#EF4444" className="mt-0.5 mr-2" />
            <View className="">
              <Text className="text-xs text-gray-500 mb-1">Origem</Text>
              <Text
                className="text-sm font-medium text-gray-900"
                numberOfLines={2}
              >
                {item.pickup.name}
              </Text>
            </View>
          </View>

          <View className="flex-row">
            <MapPin size={16} color="#10B981" className="mt-0.5 mr-2" />
            <View className="">
              <Text className="text-xs text-gray-500 mb-1">Destino</Text>
              <Text
                className="text-sm font-medium text-gray-900"
                numberOfLines={2}
              >
                {item.dropoff.name}
              </Text>
            </View>
          </View>
        </View>

        {/* Informações da corrida */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            {/* Duração */}
            <View className="flex-row items-center">
              <Clock size={14} color="#6B7280" />
              <Text className="text-xs text-gray-600 ml-1">
                {formatDuration(item.duration)}
              </Text>
            </View>

            {/* Distância */}
            <View className="flex-row items-center">
              <View className="w-1 h-1 bg-gray-400 rounded-full mr-1" />
              <Text className="text-xs text-gray-600">
                {formatDistance(item.distance)}
              </Text>
            </View>

            {/* Estafeta (se disponível) */}
            {item.driver && (
              <View className="flex-row items-center">
                <User size={14} color="#6B7280" />
                <Text
                  className="text-xs text-gray-600 ml-1 capitalize"
                  numberOfLines={1}
                >
                  {item.driver.name?.split(' ')[0]}{' '}
                  {item.driver.name?.split(' ')[1]}
                </Text>
              </View>
            )}
          </View>

          {/* Preço */}
          <View className="items-end">
            <Text className="text-lg font-bold text-gray-900">
              {formatCurrency(item.fare?.total || 0)}
            </Text>
          </View>
        </View>

        {/* Indicador de corrida em andamento */}
        {(item.status === 'pending' || item.status === 'driver_on_the_way') && (
          <View className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
            <Text className="text-xs text-amber-700 text-center font-medium">
              ⏳{' '}
              {item.status === 'driver_on_the_way'
                ? 'Motorista a caminho'
                : 'Aguardando motorista'}
            </Text>
          </View>
        )}
      </View>

      {/* Footer sutil */}
      <View className="h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-b-2xl" />
    </TouchableOpacity>
  );
}
