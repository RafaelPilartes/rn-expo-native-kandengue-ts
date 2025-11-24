import React from 'react';
import { View, Text, TextInput } from 'react-native';
import type { TextInputProps } from 'react-native';

interface InputTextAreaFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClass?: string;
}

export const InputTextAreaField = ({
  label,
  error,
  containerClass = '',
  ...props
}: InputTextAreaFieldProps) => {
  return (
    <View className={`mb-4 ${containerClass}`}>
      {label && (
        <Text className="text-sm font-semibold text-gray-700 mb-1">
          {label}
        </Text>
      )}

      <View
        className={`flex-row items-center border rounded-lg px-3 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <TextInput
          className="flex-1 py-3 text-base text-black"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          {...props}
        />
      </View>

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
};
