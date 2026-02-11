import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { WifiOff } from 'lucide-react-native'
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSequence,
  withDelay
} from 'react-native-reanimated'
import { useNetwork } from '@/hooks/useNetwork'

export const NetworkStatusBanner: React.FC = () => {
  const { isConnected, isInternetReachable } = useNetwork()

  const [visible, setVisible] = useState(false)

  // Opacity for smooth fade in/out
  const opacity = useSharedValue(0)
  // Transform for slide down effect
  const translateY = useSharedValue(-50)

  useEffect(() => {
    // Only show if we actually have a status (not null) and there's a problem
    // isConnected can be false (no wifi/data)
    // isInternetReachable can be false (wifi on but no internet)
    const isOffline =
      isConnected === false ||
      (isConnected === true && isInternetReachable === false)

    if (isOffline) {
      setVisible(true)
      opacity.value = withTiming(1, { duration: 300 })
      translateY.value = withTiming(0, { duration: 300 })
    } else {
      // Delay hiding to prevent flickering on quick reconnection
      const timeout = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 })
        translateY.value = withTiming(-50, { duration: 300 })
        setTimeout(() => setVisible(false), 300)
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [isConnected, isInternetReachable])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    }
  })

  if (!visible) return null

  return (
    <Animated.View
      style={animatedStyle}
      className="bg-red-600 pt-6 pb-4 items-center w-full"
    >
      <Text className="text-white font-bold text-base mt-4">
        Sem conexão com a internet
      </Text>
    </Animated.View>
  )
}
