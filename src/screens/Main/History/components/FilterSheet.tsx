// src/screens/Main/History/components/FilterSheet.tsx
import React, { forwardRef, useMemo, useState } from 'react'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView
} from '@gorhom/bottom-sheet'
import { View, Text, TouchableOpacity } from 'react-native'
import { X, Check } from 'lucide-react-native'

export type FilterValues = {
  status: 'all' | 'completed' | 'canceled'
  type: 'all' | 'car' | 'motorcycle' | 'bicycle' | 'delivery'
}

interface FilterSheetProps {
  currentFilters: FilterValues
  onApplyFilters: (filters: FilterValues) => void
}

const FilterSheet = forwardRef<BottomSheetModal, FilterSheetProps>(
  ({ currentFilters, onApplyFilters }, ref) => {
    const [tempFilters, setTempFilters] = useState<FilterValues>(currentFilters)

    const snapPoints = useMemo(() => ['60%'], [])

    const renderBackdrop = useMemo(
      () => (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.3}
        />
      ),
      []
    )

    const statusOptions = [
      { value: 'all', label: 'Todas' },
      { value: 'completed', label: 'Completadas' },
      { value: 'canceled', label: 'Canceladas' }
    ] as const

    const typeOptions = [
      { value: 'all', label: 'Todos' },
      { value: 'car', label: 'Carro' },
      { value: 'motorcycle', label: 'Moto' },
      { value: 'bicycle', label: 'Bicicleta' },
      { value: 'delivery', label: 'Entrega' }
    ] as const

    const handleApply = () => {
      onApplyFilters(tempFilters)
      ;(ref as any)?.current?.close()
    }

    const handleClear = () => {
      const clearedFilters: FilterValues = { status: 'all', type: 'all' }
      setTempFilters(clearedFilters)
      onApplyFilters(clearedFilters)
      ;(ref as any)?.current?.close()
    }

    const FilterOption = ({
      selected,
      label,
      onPress
    }: {
      selected: boolean
      label: string
      onPress: () => void
    }) => (
      <TouchableOpacity
        onPress={onPress}
        className={`flex-row items-center justify-between p-4 rounded-xl border-2 ${
          selected
            ? 'bg-primary-200 border-primary-200'
            : 'bg-white border-slate-200'
        }`}
        activeOpacity={0.7}
      >
        <Text
          className={`text-base font-semibold ${selected ? 'text-white' : 'text-slate-700'}`}
        >
          {label}
        </Text>
        {selected && <Check size={20} color="white" />}
      </TouchableOpacity>
    )

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ borderRadius: 32, backgroundColor: 'white' }}
        handleIndicatorStyle={{ backgroundColor: '#E2E8F0', width: 40 }}
        enablePanDownToClose
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="px-6 pt-2 pb-6 border-b border-slate-100">
            <View className="flex-row justify-between items-center">
              <Text className="text-2xl font-bold text-slate-900">Filtros</Text>
              <TouchableOpacity
                onPress={() => (ref as any)?.current?.close()}
                className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center"
              >
                <X size={20} color="#1E293B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Status Filter */}
          <View className="px-6 py-6 border-b border-slate-100">
            <Text className="text-lg font-bold text-slate-800 mb-4">
              Status
            </Text>
            <View className="gap-3">
              {statusOptions.map(option => (
                <FilterOption
                  key={option.value}
                  selected={tempFilters.status === option.value}
                  label={option.label}
                  onPress={() =>
                    setTempFilters(prev => ({ ...prev, status: option.value }))
                  }
                />
              ))}
            </View>
          </View>

          {/* Type Filter */}
          <View className="px-6 py-6 border-b border-slate-100">
            <Text className="text-lg font-bold text-slate-800 mb-4">
              Tipo de Veículo
            </Text>
            <View className="gap-3">
              {typeOptions.map(option => (
                <FilterOption
                  key={option.value}
                  selected={tempFilters.type === option.value}
                  label={option.label}
                  onPress={() =>
                    setTempFilters(prev => ({ ...prev, type: option.value }))
                  }
                />
              ))}
            </View>
          </View>

          {/* Actions */}
          <View className="px-6 py-6 gap-3">
            <TouchableOpacity
              onPress={handleApply}
              className="bg-primary-200 py-4 rounded-xl items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base">
                Aplicar Filtros
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleClear}
              className="bg-slate-100 py-4 rounded-xl items-center"
              activeOpacity={0.8}
            >
              <Text className="text-slate-700 font-bold text-base">
                Limpar Filtros
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    )
  }
)

export default FilterSheet
