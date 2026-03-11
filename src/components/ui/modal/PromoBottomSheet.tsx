import React, { forwardRef, useMemo, useCallback, memo } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView
} from '@gorhom/bottom-sheet'
import { Sparkles, ArrowRight } from 'lucide-react-native'
import type { ImageSourcePropType } from 'react-native'

export interface BannerData {
  id: string
  title: string
  description: string
  image: ImageSourcePropType
  details?: string
  ctaLabel?: string
  onCtaPress?: () => void
}

interface PromoBottomSheetProps {
  banner: BannerData | null
}

const PromoBottomSheet = forwardRef<BottomSheetModal, PromoBottomSheetProps>(
  ({ banner }, ref) => {
    const snapPoints = useMemo(() => ['55%'], [])

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

    if (!banner) return null

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
        <BottomSheetView className="flex-1 px-6 pb-8">
          {/* Banner Image */}
          <View className="overflow-hidden rounded-2xl mb-5">
            <Image
              source={banner.image}
              className="w-full h-44"
              resizeMode="cover"
            />
          </View>

          {/* Title + Badge */}
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-8 h-8 rounded-full bg-red-50 items-center justify-center">
              <Sparkles size={18} color="#e0212d" />
            </View>
            <Text className="text-xl font-bold text-slate-900 flex-1">
              {banner.title}
            </Text>
          </View>

          {/* Description */}
          <Text className="text-[15px] text-slate-600 leading-relaxed mb-6">
            {banner.details || banner.description}
          </Text>

          {/* CTA */}
          <TouchableOpacity
            activeOpacity={0.7}
            accessibilityRole="button"
            onPress={banner.onCtaPress}
            className="min-h-[48px] bg-slate-900 rounded-2xl flex-row items-center justify-center gap-2"
          >
            <Text className="text-base font-semibold text-white">
              {banner.ctaLabel || 'Saber mais'}
            </Text>
            <ArrowRight size={18} color="white" />
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    )
  }
)

export default memo(PromoBottomSheet)
