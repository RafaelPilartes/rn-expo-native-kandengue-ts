// src/screens/Rides/components/FindingDriverCard.tsx
import PrimaryButton from '@/components/ui/button/PrimaryButton';
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

type Props = {
  progress: number;
  onCancel: () => void;
};

export function FindingDriverCard({ progress, onCancel }: Props) {
  return (
    <View className="absolute bottom-0 left-0 right-0 z-10 ">
      <View className="flex p-6 bg-white rounded-t-3xl items-center shadow-md">
        <Text className="text-lg text-gray-600 text-center m-4">
          Por favor, espere! estamos aceitando sua solicitação.
        </Text>

        <View className="w-full mb-4">
          <ActivityIndicator size="large" color="#E0212D" />
        </View>

        <View className="w-full ">
          <PrimaryButton label="Cancelar procura" onPress={onCancel} />
        </View>
      </View>
    </View>
  );
}
