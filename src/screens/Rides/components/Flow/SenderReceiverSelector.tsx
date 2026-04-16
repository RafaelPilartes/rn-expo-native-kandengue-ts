// src/screens/Rides/components/Flow/SenderReceiverSelector.tsx
import React, { memo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import {
  BottomSheetTextInput as TextInput,
  useBottomSheet
} from '@gorhom/bottom-sheet'
import { User, Phone } from 'lucide-react-native'
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'

interface PersonInfo {
  name: string
  phone: string
}

interface SenderReceiverSelectorProps {
  label: string
  isSelf: boolean
  personInfo: PersonInfo
  onFocusInput: () => void
  onToggleSelf: (isSelf: boolean) => void
  onChangeName: (name: string) => void
  onChangePhone: (phone: string) => void
}

export const SenderReceiverSelector = memo(function SenderReceiverSelector({
  label,
  isSelf,
  personInfo,
  onFocusInput,
  onToggleSelf,
  onChangeName,
  onChangePhone
}: SenderReceiverSelectorProps) {
  const { snapToIndex } = useBottomSheet()

  const handleInputFocus = () => {
    snapToIndex(2) // Force to highest snap point before scrolling
    onFocusInput?.()
  }

  return (
    <View className="gap-3">
      <Text className="text-sm font-semibold text-gray-700">{label}</Text>

      {/* Toggle Buttons */}
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => onToggleSelf(true)}
          activeOpacity={0.8}
          className={`flex-1 py-3 rounded-xl border items-center ${
            isSelf ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              isSelf ? 'text-white' : 'text-gray-600'
            }`}
          >
            Eu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onToggleSelf(false)}
          activeOpacity={0.8}
          className={`flex-1 py-3 rounded-xl border items-center ${
            !isSelf ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              !isSelf ? 'text-white' : 'text-gray-600'
            }`}
          >
            Outra pessoa
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Inputs — only shown when "Outra pessoa" */}
      {!isSelf && (
        <Animated.View
          entering={FadeInDown.springify().damping(18)}
          exiting={FadeOutUp.duration(200)}
          className="gap-2"
        >
          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            <User size={17} color="#9ca3af" />
            <TextInput
              placeholder="Nome completo"
              value={personInfo.name}
              onChangeText={onChangeName}
              onFocus={handleInputFocus}
              className="flex-1 text-gray-800 font-medium ml-3"
              placeholderTextColor="#9ca3af"
              returnKeyType="next"
            />
          </View>

          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            <Phone size={17} color="#9ca3af" />
            <TextInput
              placeholder="Número de telefone"
              value={personInfo.phone}
              onChangeText={onChangePhone}
              onFocus={handleInputFocus}
              keyboardType="phone-pad"
              className="flex-1 text-gray-800 font-medium ml-3"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </Animated.View>
      )}

      {/* Auto-fill Preview — shown when "Eu" */}
      {isSelf && personInfo.name !== '' && (
        <Animated.View
          entering={FadeInDown.springify().damping(18)}
          className="flex-row items-center bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100"
        >
          <User size={15} color="#e0212d" />
          <Text
            className="text-sm text-gray-700 font-medium ml-2"
            numberOfLines={1}
          >
            {personInfo.name} · {personInfo.phone}
          </Text>
        </Animated.View>
      )}
    </View>
  )
})
