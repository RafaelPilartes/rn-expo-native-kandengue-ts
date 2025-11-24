// src/components/HeaderScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  title: string;
};

export default function HeaderScreen({ title }: Props) {
  return (
    <View className="px-4 py-5 bg-white shadow flex-row items-center justify-center">
      <Text className="text-2xl font-bold text-black">{title}</Text>
    </View>
  );
}
