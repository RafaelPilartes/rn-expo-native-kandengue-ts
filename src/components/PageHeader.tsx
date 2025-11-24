// src/components/HomeHeader.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, Switch } from 'react-native';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { DriverInterface } from '@/interfaces/IDriver';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  canGoBack: boolean;
}

const PageHeader: React.FC<HeaderProps> = ({
  title,
  subtitle,
  canGoBack = true,
}) => {
  const navigation = useNavigation<any>();

  return (
    <View className="px-4 py-5 relative bg-white shadow flex-row items-start">
      {canGoBack && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          className="absolute mt-3 ml-0 flex-row justify-start items-center gap-1 py-2 px-4"
        >
          <ArrowLeft size={16} color="#e0212d" />
          <Text className="text-s font-normal text-black">Voltar</Text>
        </TouchableOpacity>
      )}
      <View className="w-full flex-1 flex-col justify-start items-center">
        <Text className="text-xl font-bold text-black">{title}</Text>
        {subtitle && <Text className="text-sm text-gray-600">{subtitle}</Text>}
      </View>
    </View>
  );
};

export default PageHeader;
