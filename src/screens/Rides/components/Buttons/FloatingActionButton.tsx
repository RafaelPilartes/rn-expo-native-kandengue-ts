// src/screens/Ride/components/FloatingActionButton.tsx
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Navigation } from 'lucide-react-native';

interface FloatingActionButtonProps {
  icon: 'navigation' | 'phone' | 'message';
  label: string;
  onPress: () => void;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  disabled?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  label,
  onPress,
  position,
  disabled = false,
}) => {
  const getPositionStyle = () => {
    const baseStyle = { position: 'absolute' as const };

    switch (position) {
      case 'top-right':
        return { ...baseStyle, top: 170, right: 20 };
      case 'top-left':
        return { ...baseStyle, top: 100, left: 20 };
      case 'bottom-right':
        return { ...baseStyle, bottom: 120, right: 20 };
      case 'bottom-left':
        return { ...baseStyle, bottom: 120, left: 20 };
      default:
        return { ...baseStyle, top: 100, right: 20 };
    }
  };

  const getIcon = () => {
    switch (icon) {
      case 'navigation':
        return <Navigation size={20} color="white" />;
      case 'phone':
        return <Text className="text-white text-lg">📞</Text>;
      case 'message':
        return <Text className="text-white text-lg">💬</Text>;
      default:
        return <Navigation size={20} color="white" />;
    }
  };

  return (
    <View style={getPositionStyle()}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={`
          flex-row items-center px-4 py-3 rounded-full shadow-lg
          ${disabled ? 'bg-gray-400' : 'bg-blue-600'}
        `}
      >
        {getIcon()}
        <Text className="text-white font-semibold ml-2">{label}</Text>
      </TouchableOpacity>
    </View>
  );
};
