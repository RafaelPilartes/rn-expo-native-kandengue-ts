// src/components/map/MyLocationButton.tsx
import { LocateFixedIcon } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';

interface MyLocationButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isLocating?: boolean;
}

export const MyLocationButton = ({
  onPress,
  disabled = false,
  isLocating = false,
}: MyLocationButtonProps) => {
  return (
    <TouchableOpacity
      className={`
        bg-white p-3 rounded-full 
         justify-center items-center
        shadow-lg border border-gray-200
        ${disabled ? 'opacity-50' : 'opacity-100'}
        ${isLocating ? 'bg-blue-50 border-blue-200' : ''}
      `}
      onPress={onPress}
      disabled={disabled || isLocating}
      accessibilityLabel="Centralizar na minha localização"
      accessibilityHint="Move o mapa para sua localização atual"
    >
      {isLocating ? (
        <ActivityIndicator size={28} color="#3B82F6" />
      ) : (
        <LocateFixedIcon size={28} color={disabled ? '#9CA3AF' : '#3B82F6'} />
      )}
    </TouchableOpacity>
  );
};
