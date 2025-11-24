// components/ui/CountryPicker.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';

// types/components.d.ts
export interface CountryPickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export default function CountryPicker({
  selectedValue,
  onValueChange,
}: CountryPickerProps) {
  const countries = [
    { code: '+244', name: 'Angola', flag: '🇦🇴' },
    { code: '+55', name: 'Brasil', flag: '🇧🇷' },
    { code: '+27', name: 'Africa do Sul', flag: '🇿🇦' },
    { code: '+258', name: 'Moçambique', flag: '🇲🇿' },
    // Adicione mais países conforme necessário
  ];

  const selectedCountry =
    countries.find(c => c.code === selectedValue) || countries[0];

  return (
    <View className="flex-row items-center rounded-lg px-3 h-12">
      {/* Visualização do país selecionado (aparece quando o picker não está aberto) */}
      <View className="flex-row items-center mr-1">
        <Text className="text-lg mr-1">{selectedCountry.flag}</Text>
        <Text className="text-gray-800 font-medium">
          {selectedCountry.code}
        </Text>
      </View>

      {/* Picker transparente sobre o visual */}
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0, // Torna invisível, mantendo a funcionalidade
        }}
        dropdownIconColor="transparent"
      >
        {countries.map(country => (
          <Picker.Item
            key={country.code}
            label={`${country.flag} ${country.name} (${country.code})`}
            value={country.code}
          />
        ))}
      </Picker>

      {/* Ícone indicador */}
      <ChevronDown size={18} color="#6b7280" className="ml-1" />
    </View>
  );
}
