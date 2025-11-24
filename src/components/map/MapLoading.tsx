// src/screens/Map/components/MapLoading.tsx
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export const MapLoading: React.FC = () => {
  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-black/10 z-20">
      <View className="bg-white p-6 rounded-2xl shadow-lg items-center min-w-[200px]">
        <ActivityIndicator size="large" color="#EF4444" />
        <Text className="text-gray-700 font-medium mt-3">
          Buscando localização...
        </Text>
      </View>
    </View>
  );
};
