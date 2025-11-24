// src/components/Statistics.tsx
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Coins, Car } from 'lucide-react-native';
import { formatMoney } from '@/utils/formattedNumber';

interface StatisticsProps {
  balance: number;
  totalRides: number;
  isLoading?: boolean;
}

const Statistics: React.FC<StatisticsProps> = ({
  balance,
  totalRides,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <View className="px-5 py-4 flex-row justify-between">
        <View className="flex-1 mx-1 bg-white p-4 rounded-2xl items-center justify-center">
          <ActivityIndicator size="small" color="#EF4444" />
        </View>
        <View className="w-1/3 mx-1 bg-white p-4 rounded-2xl items-center justify-center">
          <ActivityIndicator size="small" color="#EF4444" />
        </View>
      </View>
    );
  }

  return (
    <View className="px-5 py-4 flex-row justify-between">
      {/* Saldo */}
      <View className="flex-1 mx-1 bg-white p-4 rounded-2xl items-end">
        <View className="w-full flex-row items-center justify-start gap-2">
          <View className="bg-red-600 p-1.5 rounded-full">
            <Coins size={14} color="white" />
          </View>
          <Text className="text-xs text-gray-500 mt-1">Saldo em carteira</Text>
        </View>
        <Text className="text-start text-2xl font-extrabold text-gray-900">
          Kz {formatMoney(balance, 0)}
        </Text>
      </View>

      {/* Corridas */}
      <View className="w-1/3 mx-1 bg-white p-4 rounded-2xl items-end">
        <View className="w-full flex-row items-center justify-start gap-2">
          <View className="bg-red-600 p-1.5 rounded-full">
            <Car size={14} color="white" />
          </View>
          <Text className="text-xs text-gray-500 mt-1">Corridas</Text>
        </View>
        <Text className="text-start text-2xl font-extrabold text-gray-900">
          {totalRides}
        </Text>
      </View>
    </View>
  );
};

export default Statistics;
