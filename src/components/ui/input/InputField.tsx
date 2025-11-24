// src/components/form/InputField.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import type { TextInputProps } from 'react-native';

interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  onClickIcon?: () => void;
  error?: string;
  rightIcon?: React.ReactNode;
  containerClass?: string;
}

export const InputField = ({
  label,
  icon,
  onClickIcon,
  error,
  rightIcon,
  containerClass = '',
  ...props
}: InputFieldProps) => {
  return (
    <View className={`mb-4 ${containerClass}`}>
      {label && (
        <Text className="text-sm font-semibold text-gray-700 mb-1">
          {label}
        </Text>
      )}

      <View
        className={`flex-row items-center border rounded-full px-3 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        {icon && <View className="mr-2">{icon}</View>}
        <TextInput
          className="flex-1 py-3 text-base text-black"
          placeholderTextColor="#9ca3af"
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onClickIcon}>{rightIcon}</TouchableOpacity>
        )}
      </View>

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
};
