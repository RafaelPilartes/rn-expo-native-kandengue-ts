import React from 'react';
import { View, Text } from 'react-native';
import { useNetwork } from '@/hooks/useNetwork';

export default function NetworkBanner() {
  const { isConnected } = useNetwork();

  if (isConnected === null) {
    return null; // ainda carregando
  }

  if (!isConnected) {
    return (
      <View className="bg-red-500 p-3">
        <Text className="text-white text-center font-bold">
          Sem conexão com a internet
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-green-500 p-3">
      <Text className="text-white text-center font-bold">
        Conectado à internet
      </Text>
    </View>
  );
}
