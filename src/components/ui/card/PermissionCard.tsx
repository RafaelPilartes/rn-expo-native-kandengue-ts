// components/ui/card/PermissionCard.tsx - Versão estendida
import React, { JSX } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface PermissionCardProps {
  icon: JSX.Element;
  label: string;
  description: string;
  statusIcon?: JSX.Element;
  statusColor?: string;
  onPress?: () => void;
  disabled?: boolean;
  showButton?: boolean;
  buttonLabel?: string;
}

const PermissionCard: React.FC<PermissionCardProps> = ({
  icon,
  label,
  description,
  statusIcon,
  statusColor = '#6B7280',
  onPress,
  disabled = false,
  showButton = true,
  buttonLabel = 'Allow',
}) => {
  return (
    <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-start flex-1">
          <View className="mr-3 mt-1">{icon}</View>

          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-semibold text-gray-900 flex-1">
                {label}
              </Text>

              {statusIcon && (
                <View
                  style={{ backgroundColor: statusColor + '20' }}
                  className="p-1 rounded-full"
                >
                  {statusIcon}
                </View>
              )}
            </View>

            <Text className="text-sm text-gray-600 mt-1">{description}</Text>
          </View>
        </View>
      </View>

      {showButton && onPress && (
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled}
          className={`mt-3 py-2 px-4 rounded-lg ${
            disabled ? 'bg-gray-300' : 'bg-blue-500'
          }`}
        >
          <Text
            className={`text-center font-medium ${
              disabled ? 'text-gray-500' : 'text-white'
            }`}
          >
            {buttonLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PermissionCard;
