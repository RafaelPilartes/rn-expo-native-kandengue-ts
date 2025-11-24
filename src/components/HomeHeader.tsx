// src/components/HomeHeader.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, Switch } from 'react-native';
import { Bell, RefreshCw } from 'lucide-react-native';
import { UserInterface } from '@/interfaces/IUser';

interface HeaderProps {
  user: UserInterface | null;
  onNotifications: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onNotifications,
  onRefresh,
  isRefreshing = false,
}) => {
  const firstName = user?.name.split(' ')[0] || '';
  const lastName = user?.name.split(' ')[1] || '';

  //  Get greeting message
  const getGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Bom dia';
    } else if (hour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  };

  return (
    <View className="px-5 py-4 flex-row items-center justify-between mb-2 bg-white">
      <View className="flex-row items-center">
        <Image
          source={{
            uri:
              user?.photo ??
              'https://cdn-icons-png.flaticon.com/512/3541/3541871.png',
          }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View>
          <Text className="text-base font-normal text-gray-800">
            {getGreetingMessage()},
          </Text>
          <Text className="text-lg font-semibold text-gray-800">
            {firstName} {lastName}
          </Text>
        </View>
      </View>

      {/* Botões de ação */}
      <View className="flex-row items-center gap-2">
        {/* Botão de atualizar */}
        {onRefresh && (
          <TouchableOpacity
            onPress={onRefresh}
            disabled={isRefreshing}
            className="bg-gray-100 p-2 rounded-full"
          >
            <RefreshCw
              size={20}
              color={isRefreshing ? '#9CA3AF' : '#6B7280'}
              className={isRefreshing ? 'animate-spin' : ''}
            />
          </TouchableOpacity>
        )}
        {/* Notificação */}
        <TouchableOpacity
          onPress={onNotifications}
          activeOpacity={0.7}
          disabled={isRefreshing}
          className="p-2 rounded-full bg-gray-100 items-center justify-center "
        >
          <Bell size={24} color="#6a6f77" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
