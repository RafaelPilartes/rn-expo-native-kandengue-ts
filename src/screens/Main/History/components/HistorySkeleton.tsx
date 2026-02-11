// src/screens/Main/History/components/HistorySkeleton.tsx
import React from 'react'
import { View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue
} from 'react-native-reanimated'

export default function HistorySkeleton() {
  const opacity = useSharedValue(0.3)

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  const SkeletonBox = ({
    width,
    height,
    className = ''
  }: {
    width: number
    height: number
    className?: string
  }) => (
    <Animated.View
      className={`bg-slate-200 rounded-xl ${className}`}
      style={[animatedStyle, { width, height }]}
    />
  )

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header Stats Skeleton */}
      <View className="px-4 mb-2 mt-4">
        <View className="flex-1 flex-col justify-center items-center py-6 bg-white rounded-lg border border-gray-200/40">
          <SkeletonBox width={60} height={32} className="mb-2" />
          <SkeletonBox width={120} height={16} />
        </View>
      </View>

      {/* Filter Bar Skeleton */}
      <View className="px-4 py-3 flex-row gap-2">
        <SkeletonBox width={80} height={32} className="rounded-full" />
        <SkeletonBox width={100} height={32} className="rounded-full" />
      </View>

      {/* Section Header Skeleton */}
      <View className="px-5 py-3 pt-6">
        <SkeletonBox width={100} height={20} className="rounded-full" />
      </View>

      {/* Ride Items Skeleton */}
      {[1, 2, 3, 4].map((item, index) => (
        <Animated.View
          key={item}
          className="bg-white mx-5 mb-4 rounded-3xl border border-slate-100 overflow-hidden"
          style={[animatedStyle, { opacity: 0.3 + index * 0.1 }]}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 bg-slate-50/50 border-b border-slate-100">
            <View className="flex-row items-center gap-3">
              <SkeletonBox width={40} height={40} className="rounded-full" />
              <View>
                <SkeletonBox width={80} height={16} className="mb-2" />
                <SkeletonBox width={140} height={12} />
              </View>
            </View>
            <SkeletonBox width={70} height={24} className="rounded-full" />
          </View>

          {/* Content */}
          <View className="p-5">
            {/* Route */}
            <View className="flex-row relative mb-6">
              <View className="items-center mr-4 pt-1.5">
                <SkeletonBox
                  width={10}
                  height={10}
                  className="rounded-full mb-1"
                />
                <SkeletonBox width={4} height={60} className="my-1" />
                <SkeletonBox width={10} height={10} className="rounded-sm" />
              </View>

              <View className="flex-1 gap-6">
                <View>
                  <SkeletonBox width={60} height={10} className="mb-1" />
                  <View className="mb-1">
                    <SkeletonBox width={280} height={16} />
                  </View>
                  <SkeletonBox width={220} height={14} />
                </View>

                <View>
                  <SkeletonBox width={60} height={10} className="mb-1" />
                  <View className="mb-1">
                    <SkeletonBox width={280} height={16} />
                  </View>
                  <SkeletonBox width={200} height={14} />
                </View>
              </View>
            </View>

            {/* Footer */}
            <View className="flex-row justify-between items-end pt-4 border-t border-slate-50">
              <View className="flex-row gap-4">
                <SkeletonBox width={70} height={28} className="rounded-md" />
                <SkeletonBox width={80} height={28} className="rounded-md" />
              </View>
              <SkeletonBox width={80} height={24} />
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  )
}
