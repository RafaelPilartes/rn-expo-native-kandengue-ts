// components/ui/PinInput.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

interface PinInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function PinInput({
  length,
  value,
  onChange,
  className = '',
}: PinInputProps) {
  const handleChange = (text: string) => {
    if (/^\d*$/.test(text)) {
      // Aceita apenas números
      onChange(text.slice(0, length));
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && index > 0) {
      // Foca no campo anterior ao apagar
      const ref = refs.current[index - 1];
      ref?.focus();
    }
  };

  const refs = React.useRef<(TextInput | null)[]>([]);

  return (
    <View className={`flex-row justify-center space-x-3 ${className}`}>
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          className={`w-12 h-16 border rounded-lg items-center justify-center ${
            value[index] ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <Text className="text-2xl font-bold text-gray-800">
            {value[index] || ''}
          </Text>
          <TextInput
            // ref={ref => (refs.current[index] = ref)}
            className="absolute w-full h-full opacity-0"
            value=""
            onChangeText={handleChange}
            onKeyPress={({ nativeEvent: { key } }) =>
              handleKeyPress(index, key)
            }
            keyboardType="number-pad"
            maxLength={1}
            autoFocus={index === 0}
          />
        </View>
      ))}
    </View>
  );
}
