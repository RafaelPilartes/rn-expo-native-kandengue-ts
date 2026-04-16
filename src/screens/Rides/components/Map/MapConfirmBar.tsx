// src/screens/Rides/components/Map/MapConfirmBar.tsx
import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { MapPin, X, Check } from 'lucide-react-native'
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface MapConfirmBarProps {
  mode: 'pickup' | 'dropoff'
  address: string | null
  isLoading: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function MapConfirmBar({
  mode,
  address,
  isLoading,
  onConfirm,
  onCancel
}: MapConfirmBarProps) {
  const insets = useSafeAreaInsets()
  const isPickup = mode === 'pickup'
  const accentColor = isPickup ? '#10b981' : '#ef4444'
  const label = isPickup ? 'Ponto de Recolha' : 'Ponto de Entrega'
  const dotBg = isPickup ? 'bg-green-500' : 'bg-red-500'

  return (
    <>
      {/* Cancel button (top right, always visible) */}
      <Animated.View
        entering={FadeInUp.springify().damping(30)}
        exiting={FadeOutDown}
        className="absolute z-50"
        style={{ top: Math.max(insets.top + 16, 60), right: 16 }}
      >
        <TouchableOpacity
          onPress={onCancel}
          activeOpacity={0.8}
          className="w-10 h-10 rounded-full bg-white items-center justify-center"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
            elevation: 6
          }}
        >
          <X size={18} color="#374151" strokeWidth={2.5} />
        </TouchableOpacity>
      </Animated.View>

      {/* Confirm bar (bottom, above BottomSheet) */}
      <Animated.View
        entering={FadeInUp.springify().damping(30)}
        exiting={FadeOutDown}
        className="absolute left-4 right-4 z-50 bg-white rounded-3xl px-5 py-4"
        style={{
          bottom: Math.max(insets.bottom + 120, 100), // Adjusted space to clear the collapsed 12% bottom sheet
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 10
        }}
      >
        <View className="flex-row items-center">
          {/* Mode icon */}
          <View
            className={`w-10 h-10 rounded-2xl items-center justify-center mr-4 ${dotBg}`}
          >
            <MapPin size={18} color="white" strokeWidth={2.5} />
          </View>

          {/* Address text */}
          <View className="flex-1 mr-3">
            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              {label}
            </Text>
            {isLoading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size={12} color="#6b7280" />
                <Text className="text-xs text-gray-400 ml-2">
                  A calcular endereço...
                </Text>
              </View>
            ) : (
              <Text
                className="text-sm font-semibold text-gray-800 leading-5"
                numberOfLines={2}
              >
                {address ?? 'Mova o mapa para ajustar'}
              </Text>
            )}
          </View>

          {/* Confirm button */}
          <TouchableOpacity
            onPress={onConfirm}
            disabled={isLoading || !address}
            activeOpacity={0.8}
            className="w-12 h-12 rounded-2xl items-center justify-center"
            style={{
              backgroundColor: isLoading || !address ? '#e5e7eb' : accentColor
            }}
          >
            <Check
              size={20}
              color={isLoading || !address ? '#9ca3af' : 'white'}
              strokeWidth={3}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  )
}
