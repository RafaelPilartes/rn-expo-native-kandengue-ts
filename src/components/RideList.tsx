// src/components/RideList.tsx
import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { AlertCircle, Car } from 'lucide-react-native';
import { DriverInterface } from '@/interfaces/IDriver';
import { RideInterface } from '@/interfaces/IRide';
import RideCard from './RideCard';

interface RideListProps {
  driver: DriverInterface | null;
  rides: RideInterface[] | undefined;
  onToDocuments: () => void;
  onDetailsRide: (ride: RideInterface) => void;
}

const RideList: React.FC<RideListProps> = ({
  driver,
  rides,
  onToDocuments,
  onDetailsRide,
}) => {
  // Estado quando driver está offline
  if (!driver?.is_online && driver?.status === 'active') {
    return (
      <View className="flex-1 items-center justify-center px-5">
        <Car size={64} color="gray" />
        <Text className="text-center text-gray-500 mt-4">
          Você está offline. Ative o modo online para receber solicitações de
          corridas.
        </Text>
      </View>
    );
  }

  // Estado quando conta não está ativa
  if (driver?.is_online && driver?.status !== 'active') {
    return (
      <View className="flex-1 items-center justify-center px-5">
        <AlertCircle size={64} color="gray" />
        <Text className="text-center text-gray-500 mt-4">
          A sua conta precisa estar ativa para receber solicitações de corridas.
        </Text>
        <Text
          className="text-center text-blue-500 mt-2 underline"
          onPress={onToDocuments}
        >
          Verificar documentos
        </Text>
      </View>
    );
  }

  // Estado quando online e ativo, mas sem corridas
  if (driver?.is_online && driver?.status === 'active') {
    return (
      <View className="flex-1 px-5">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold text-gray-800">
            Solicitações ({rides?.length})
          </Text>
        </View>

        {/* Aqui você pode renderizar a lista de corridas */}
        {rides ? (
          <>
            <FlatList
              data={rides}
              keyExtractor={item => item.id as string}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <RideCard
                  ride={item}
                  onPressDetails={() => onDetailsRide(item)}
                />
              )}
              ItemSeparatorComponent={() => <View className="h-3" />}
            />
          </>
        ) : (
          // <FlatList
          //   data={rides}
          //   keyExtractor={item => item.id as string}
          //   contentContainerStyle={{ padding: 16 }}
          //   renderItem={({ item }) => (
          //     <View className="bg-white p-4 rounded-2xl mb-4 shadow-sm">
          //       {/* Header do pedido */}
          //       <View className="flex-row items-center justify-between mb-3">
          //         <View className="flex-row items-center">
          //           <Image
          //             source={{
          //               uri:
          //                 item.user.photo ??
          //                 'https://cdn-icons-png.freepik.com/512/7718/7718888.png',
          //             }}
          //             className="w-10 h-10 rounded-full mr-3"
          //           />
          //           <View>
          //             <Text className="font-semibold text-gray-900">
          //               {item.id}
          //             </Text>
          //             <Text className="text-xs text-gray-500"> 5min </Text>
          //           </View>
          //         </View>
          //         <View>
          //           <Text className="text-lg font-bold text-red-600">
          //             Kz {item.fare.total}
          //           </Text>
          //           <Text className="text-sm text-gray-500 text-right">
          //             {item.distance}
          //           </Text>
          //         </View>
          //       </View>

          //       {/* Rota */}
          //       <View className="mb-4">
          //         <View className="flex-row items-center mb-2">
          //           <View className="w-2 h-2 rounded-full bg-red-500 mr-3 mb-4" />
          //           {/* Origem */}
          //           <View className="flex-col items-start">
          //             <Text className="text-sm font-medium text-gray-700">
          //               RECOLHA ({item.pickup.name})
          //             </Text>
          //             <Text className="text-xs text-gray-700">
          //               Distancia até você - 3km • 5min
          //             </Text>
          //           </View>
          //         </View>
          //         {/* Destino */}
          //         <View className="flex-row items-center">
          //           <View className="w-2 h-2 rounded-full bg-black mr-3" />
          //           <Text className="text-sm text-gray-700">
          //             ENTREGA ({item.dropoff.name})
          //           </Text>
          //         </View>
          //       </View>

          //       {/* Botão Ver detalhes */}
          //       <View className="max-w-44 mt-2">
          //         <TouchableOpacity
          //           onPress={() => handleDetailsRide(item)}
          //           className="bg-red-600 py-3 rounded-full items-center"
          //         >
          //           <Text className="text-white font-semibold text-lg">
          //             Ver detalhes
          //           </Text>
          //         </TouchableOpacity>
          //       </View>
          //     </View>
          //   )}
          // />
          <View className="flex-1 items-center justify-center">
            <Car size={64} color="gray" />
            <Text className="text-center text-gray-500 mt-4">
              Nenhuma corrida disponível no momento.
            </Text>
            <Text className="text-center text-gray-400 text-sm mt-2">
              Novas corridas aparecerão aqui automaticamente
            </Text>
          </View>
        )}
      </View>
    );
  }

  return null;
};

export default RideList;
