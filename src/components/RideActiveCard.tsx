import { RideInterface } from '@/interfaces/IRide';
import { formatDistance } from '@/utils/formatDistance';
import { formatMoney } from '@/utils/formattedNumber';
import { Clock, Package, User } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

// 🔥 COMPONENTE: Card de Corrida Ativa
export const RideActiveCard = ({
  ride,
  onPress,
}: {
  ride: RideInterface;
  onPress: (ride: RideInterface) => void;
}) => {
  const getStatusInfo = () => {
    switch (ride.status) {
      case 'idle':
        return {
          label: 'Procurando estafeta',
          color: 'bg-gray-100',
          textColor: 'text-gray-700',
        };
      case 'driver_on_the_way':
        return {
          label: 'Motorista a caminho',
          color: 'bg-blue-100',
          textColor: 'text-blue-700',
        };
      case 'arrived_pickup':
        return {
          label: 'No local de recolha',
          color: 'bg-green-100',
          textColor: 'text-green-700',
        };
      case 'picked_up':
        return {
          label: 'Em entrega',
          color: 'bg-orange-100',
          textColor: 'text-orange-700',
        };
      case 'arrived_dropoff':
        return {
          label: 'Chegou ao destino',
          color: 'bg-purple-100',
          textColor: 'text-purple-700',
        };
      default:
        return {
          label: 'Em andamento',
          color: 'bg-gray-100',
          textColor: 'text-gray-700',
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-3"
      onPress={() => onPress(ride)}
      activeOpacity={0.7}
    >
      {/* Header com status */}
      <View className="flex-row justify-between items-center mb-3">
        <View className={`px-3 py-1 rounded-full ${statusInfo.color}`}>
          <Text className={`text-xs font-medium ${statusInfo.textColor}`}>
            {statusInfo.label}
          </Text>
        </View>
        <Text className="text-gray-900 font-bold">
          Kz {formatMoney(ride.fare?.total || 0, 0)}
        </Text>
      </View>

      {/* Rota */}
      <View className="space-y-2 mb-3">
        <View className="flex-row items-center">
          <View className="w-2 h-2 bg-green-500 rounded-full mr-3" />
          <Text className="text-gray-700 text-sm flex-1" numberOfLines={1}>
            {ride.pickup.description}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="w-2 h-2 bg-red-500 rounded-full mr-3" />
          <Text className="text-gray-700 text-sm flex-1" numberOfLines={1}>
            {ride.dropoff.description}
          </Text>
        </View>
      </View>

      {/* Informações adicionais */}
      <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
        <View className="flex-row items-center">
          <Clock size={14} color="#6B7280" />
          <Text className="text-gray-600 text-xs ml-1">
            {ride.duration} min
          </Text>
        </View>

        <View className="flex-row items-center">
          <Package size={14} color="#6B7280" />
          <Text className="text-gray-600 text-xs ml-1">
            {formatDistance(ride.distance)}
          </Text>
        </View>

        {ride.driver && (
          <View className="flex-row items-center">
            <User size={14} color="#6B7280" />
            <Text className="text-gray-600 text-xs ml-1">
              {ride.driver.name?.split(' ')[0]}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
