import { RideInterface } from '@/interfaces/IRide';
import { formatFullDate } from '@/utils/formatDate';
import { formatMoney } from '@/utils/formattedNumber';
import { View, Image, Text, TouchableOpacity } from 'react-native';

// Componente de Card de Corrida
interface RideCardProps {
  ride: RideInterface;
  onPressDetails: () => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onPressDetails }) => {
  return (
    <View className="bg-white p-4 rounded-2xl mb-2 shadow-sm border border-gray-100">
      {/* Header do pedido */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Image
            source={{
              uri:
                ride.user?.photo ??
                'https://cdn-icons-png.freepik.com/512/7718/7718888.png',
            }}
            className="w-10 h-10 rounded-full mr-3"
          />
          <View>
            <Text className="font-semibold text-gray-900">
              {ride.user?.name || 'Cliente'}
            </Text>
            <Text className="text-xs text-gray-500">
              {formatFullDate(ride.created_at, 'dd/MM/yyyy HH:mm')}
            </Text>
          </View>
        </View>
        <View>
          <Text className="text-lg font-bold text-red-600">
            Kz {formatMoney(ride.fare?.total || 0, 0)}
          </Text>
          <Text className="text-sm text-gray-500 text-right">
            {ride.distance ? `${ride.distance} km` : '-- km'}
          </Text>
        </View>
      </View>

      {/* Rota */}
      <View className="mb-4">
        {/* Origem */}
        <View className="flex-row items-start mb-3">
          <View className="w-2 h-2 rounded-full bg-red-500 mr-3 mt-1.5" />
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              RECOLHA {ride.pickup?.name ? `(${ride.pickup.name})` : ''}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              Distância até você • {'--'} km
            </Text>
          </View>
        </View>

        {/* Destino */}
        <View className="flex-row items-start">
          <View className="w-2 h-2 rounded-full bg-black mr-3 mt-1.5" />
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              ENTREGA {ride.dropoff?.name ? `(${ride.dropoff.name})` : ''}
            </Text>
            <Text className="text-xs text-gray-600" numberOfLines={2}>
              Distância até o destino • {ride.distance || 'Endereço de entrega'}
            </Text>
          </View>
        </View>
      </View>

      {/* 
      Informações adicionais
      {(ride.details?.item?.type || ride.details?.item?.description) && (
        <View className="mb-4 p-3 bg-gray-50 rounded-lg">
          <Text className="text-sm font-medium text-gray-700 mb-1">
            📦 {ride.details?.item?.type || 'Pacote'}
          </Text>
          {ride.details?.item?.description && (
            <Text className="text-xs text-gray-600" numberOfLines={2}>
              {ride.details.item.description}
            </Text>
          )}
        </View>
      )} */}

      {/* Botão Ver detalhes */}
      <View className="flex-row justify-end">
        <TouchableOpacity
          onPress={onPressDetails}
          className="bg-red-600 px-6 py-3 rounded-full items-center min-w-[140px]"
        >
          <Text className="text-white font-semibold text-base">
            {ride.status === 'idle' ? 'Ver detalhes' : 'Voltar a corrida'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RideCard;
