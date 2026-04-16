// src/screens/Rides/components/Flow/ArticlePickerSheet.tsx
import React, { useCallback, forwardRef, useMemo, memo } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import { Check } from 'lucide-react-native'
import { ArticleOptions } from '@/constants/article'

interface ArticlePickerSheetProps {
  selected: string
  onSelect: (value: string) => void
}

const ArticleItem = memo(function ArticleItem({
  label,
  value,
  isSelected,
  onPress,
}: {
  label: string
  value: string
  isSelected: boolean
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center justify-between px-5 py-4 border-b border-gray-100 ${
        isSelected ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <Text
        className={`text-base ${
          isSelected ? 'font-semibold text-gray-900' : 'font-normal text-gray-700'
        }`}
      >
        {label}
      </Text>
      {isSelected && <Check size={18} color="#10b981" />}
    </TouchableOpacity>
  )
})

export const ArticlePickerSheet = forwardRef<
  BottomSheetModal,
  ArticlePickerSheetProps
>(function ArticlePickerSheet({ selected, onSelect }, ref) {
  const snapPoints = useMemo(() => ['55%', '80%'], [])

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
      />
    ),
    []
  )

  const renderItem = useCallback(
    ({ item }: { item: (typeof ArticleOptions)[0] }) => (
      <ArticleItem
        label={item.label}
        value={item.value}
        isSelected={selected === item.value}
        onPress={() => {
          onSelect(item.value)
          ;(ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()
        }}
      />
    ),
    [selected, onSelect, ref]
  )

  const keyExtractor = useCallback(
    (item: (typeof ArticleOptions)[0]) => item.value,
    []
  )

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: '#D1D5DB', width: 40 }}
      backgroundStyle={{ backgroundColor: '#FFFFFF' }}
    >
      <View className="px-5 pt-2 pb-4 border-b border-gray-100">
        <Text className="text-lg font-bold text-gray-900">
          Tipo de Encomenda
        </Text>
        <Text className="text-sm text-gray-500 mt-0.5">
          Selecione a categoria que melhor descreve o seu artigo
        </Text>
      </View>

      <BottomSheetFlatList
        data={ArticleOptions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </BottomSheetModal>
  )
})
