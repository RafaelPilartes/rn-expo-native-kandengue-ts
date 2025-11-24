// src/screens/Ride/components/LoadingCard.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export function LoadingCard() {
  return (
    <View className="absolute bottom-6 left-0 right-0 z-10 flex">
      <View className="h-40 bg-white justify-center items-center rounded-xl mx-8">
        <ActivityIndicator size="large" color="red" />
      </View>
    </View>
  );
}
