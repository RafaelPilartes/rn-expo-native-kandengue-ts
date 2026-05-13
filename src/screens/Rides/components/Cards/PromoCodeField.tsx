import React, { useState } from 'react'
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Check, ChevronDown, ChevronUp, Tag, X } from 'lucide-react-native'
import type { PromotionFeedback } from '@/viewModels/PromotionViewModel'

interface PromoCodeFieldProps {
  feedback: PromotionFeedback
  onValidate: (code: string) => void
  onClear: () => void
  disabled?: boolean
}

export function PromoCodeField({
  feedback,
  onValidate,
  onClear,
  disabled,
}: PromoCodeFieldProps) {
  const [expanded, setExpanded] = useState(false)
  const [code, setCode] = useState('')

  const isLoading = feedback.state === 'validating'
  const isValid = feedback.state === 'valid'
  const isError = feedback.state === 'error'

  const handleApply = () => {
    const trimmed = code.trim()
    if (trimmed.length < 3) return
    onValidate(trimmed.toUpperCase())
  }

  const handleClear = () => {
    setCode('')
    onClear()
  }

  if (!expanded) {
    return (
      <TouchableOpacity
        className="flex-row items-center justify-between px-4 py-3 mb-3 bg-gray-50 rounded-xl border border-gray-100"
        onPress={() => setExpanded(true)}
        disabled={disabled}
      >
        <View className="flex-row items-center">
          <Tag size={16} color="#6B7280" />
          <Text className="ml-2 text-gray-700">
            {isValid && feedback.state === 'valid'
              ? `Código aplicado: ${feedback.result.code_applied}`
              : 'Tens um código promocional?'}
          </Text>
        </View>
        <ChevronDown size={18} color="#6B7280" />
      </TouchableOpacity>
    )
  }

  return (
    <View className="mb-3 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
      <TouchableOpacity
        className="flex-row items-center justify-between px-4 py-3"
        onPress={() => setExpanded(false)}
      >
        <View className="flex-row items-center">
          <Tag size={16} color="#6B7280" />
          <Text className="ml-2 text-gray-700 font-medium">
            Código promocional
          </Text>
        </View>
        <ChevronUp size={18} color="#6B7280" />
      </TouchableOpacity>

      <View className="px-4 pb-4">
        <View className="flex-row items-center bg-white rounded-lg border border-gray-200 px-3">
          <TextInput
            value={code}
            onChangeText={text => setCode(text.toUpperCase())}
            autoCapitalize="characters"
            placeholder="WELCOME10"
            placeholderTextColor="#9CA3AF"
            editable={!isLoading && !disabled}
            className="flex-1 py-3 text-base text-gray-900"
          />
          {isValid ? (
            <TouchableOpacity onPress={handleClear} className="p-2">
              <X size={18} color="#EF4444" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleApply}
              disabled={isLoading || code.trim().length < 3 || disabled}
              className="px-3 py-2"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#10B981" />
              ) : (
                <Text className="text-primary-200 font-semibold">
                  Aplicar
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {isValid && feedback.state === 'valid' && (
          <View className="flex-row items-center mt-2">
            <Check size={14} color="#10B981" />
            <Text className="ml-1 text-green-600 text-sm">
              Desconto de {Math.round(feedback.result.discount_amount)} AOA
              aplicado
            </Text>
          </View>
        )}

        {isError && feedback.state === 'error' && (
          <Text className="mt-2 text-red-500 text-sm">
            {feedback.message}
          </Text>
        )}
      </View>
    </View>
  )
}
