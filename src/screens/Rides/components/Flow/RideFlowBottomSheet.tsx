import React, { useCallback, useMemo, useRef, memo } from 'react'
import { View } from 'react-native'
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView
} from '@gorhom/bottom-sheet'
import { useRideFlowStore } from '@/storage/store/useRideFlowStore'
import { RouteInputStep } from './RouteInputStep'
import { DeliveryOptionsStep } from './DeliveryOptionsStep'
import { DeliveryDetailsStep } from './DeliveryDetailsStep'
import { RideFareInterface } from '@/interfaces/IRideFare'

interface RideFlowBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>
  fareDetails: RideFareInterface | null
  distanceKm: number | undefined
  durationMinutes: number | undefined
  isLoadingRoute: boolean
}

// Step indicator dots
const StepIndicator = memo(function StepIndicator({ step }: { step: number }) {
  return (
    <View className="flex-row items-center justify-center gap-2 pb-2 pt-1">
      {[1, 2, 3].map(s => (
        <View
          key={s}
          className={`rounded-full transition-all ${
            s === step ? 'w-5 h-1.5 bg-primary-200' : 'w-1.5 h-1.5 bg-gray-300'
          }`}
        />
      ))}
    </View>
  )
})

const SNAP_POINTS_BY_STEP: Record<number, string[]> = {
  1: ['45%', '80%'],
  2: ['55%', '75%', '85%'],
  3: ['50%', '70%', '85%']
}

// Starting snap index per step
const INITIAL_INDEX_BY_STEP: Record<number, number> = {
  1: 0,
  2: 1,
  3: 1
}

export const RideFlowBottomSheet = memo(function RideFlowBottomSheet({
  bottomSheetRef,
  fareDetails,
  distanceKm,
  durationMinutes,
  isLoadingRoute
}: RideFlowBottomSheetProps) {
  const { step, mapPickingMode } = useRideFlowStore()

  // Single scroll ref shared across all steps that need keyboard-aware scrolling
  const scrollRef = useRef<any>(null)

  const snapPoints = useMemo(() => {
    if (mapPickingMode !== null) return ['12%'] // Almost closed, revealing the map
    return SNAP_POINTS_BY_STEP[step] ?? ['40%']
  }, [step, mapPickingMode])

  const initialIndex = useMemo(() => {
    if (mapPickingMode !== null) return 0
    return INITIAL_INDEX_BY_STEP[step] ?? 0
  }, [step, mapPickingMode])

  const renderContent = useCallback(() => {
    switch (step) {
      case 1:
        return <RouteInputStep />
      case 2:
        return (
          <DeliveryOptionsStep
            scrollRef={scrollRef}
            fareDetails={fareDetails}
            distanceKm={distanceKm}
            durationMinutes={durationMinutes}
            isLoadingRoute={isLoadingRoute}
          />
        )
      case 3:
        return <DeliveryDetailsStep scrollRef={scrollRef} />
      default:
        return null
    }
  }, [step, fareDetails, distanceKm, durationMinutes, isLoadingRoute])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={initialIndex}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      handleIndicatorStyle={{ backgroundColor: '#E5E7EB', width: 36 }}
      backgroundStyle={{
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 12
      }}
    >
      <BottomSheetScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <StepIndicator step={step} />

        {renderContent()}
      </BottomSheetScrollView>
    </BottomSheet>
  )
})
