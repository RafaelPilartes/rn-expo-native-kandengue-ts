import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable
} from 'react-native'

interface Option {
  label: string
  value: string
}

interface SelectFieldProps {
  label?: string
  placeholder?: string
  options: Option[]
  value?: string
  onSelect: (value: string) => void
  error?: string
  containerClass?: string
}

export const SelectField = ({
  label,
  placeholder = 'Selecione uma opção',
  options,
  value,
  onSelect,
  error,
  containerClass = ''
}: SelectFieldProps) => {
  const [visible, setVisible] = useState(false)

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <View className={`mb-4 ${containerClass}`}>
      {label && (
        <Text className="text-sm font-semibold text-gray-700 mb-1">
          {label}
        </Text>
      )}

      {/* Botão do select */}
      <TouchableOpacity
        className={`flex-row items-center justify-between border rounded-full px-3 py-3 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        onPress={() => setVisible(true)}
      >
        <Text
          className={`text-base ${
            selectedOption ? 'text-black' : 'text-gray-400'
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
      </TouchableOpacity>

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}

      {/* Modal de opções */}
      <Modal visible={visible} transparent animationType="slide">
        {/* <Pressable */}
        <View
          className="flex-1 bg-black/40 mb-safe"
          // onPress={() => setVisible(false)}
        >
          <View className="mt-auto bg-white rounded-t-2xl p-4 max-h-[60%]">
            <Text className="text-lg font-semibold mb-3">{label}</Text>

            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`py-3 border-b ${
                    item.value === value && 'bg-gray-100 px-3'
                  } border-gray-200`}
                  onPress={() => {
                    onSelect(item.value)
                    setVisible(false)
                  }}
                >
                  <Text className="text-base">{item.label}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              className="mt-4 py-3 bg-gray-200 rounded-full"
              onPress={() => setVisible(false)}
            >
              <Text className="text-center text-gray-600 font-medium">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}
