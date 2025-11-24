// src/components/ui/BackButton.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const BackButton = ({
  className = '',
  iconColor = '#fff', // Cor padrão azul (primary)
  onPress,
}: {
  className?: string;
  iconColor?: string;
  onPress?: () => void;
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      className={`bg-gray-200 p-3 rounded-full ${className}`}
      accessibilityLabel="Voltar"
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
    >
      <ArrowLeft size={28} color={iconColor} />
    </TouchableOpacity>
  );
};
