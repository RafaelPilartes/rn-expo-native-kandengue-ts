// src/screens/Rides/components/Map/MapPinOverlay.tsx
import React, { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated'

interface MapPinOverlayProps {
  /** 'pickup' → green pin, 'dropoff' → red pin */
  mode: 'pickup' | 'dropoff'
  /** True while the map camera is moving (drag in progress) */
  isDragging: boolean
}

const PICKUP_COLOR = '#10b981' // green-500
const DROPOFF_COLOR = '#ef4444' // red-500

export function MapPinOverlay({ mode, isDragging }: MapPinOverlayProps) {
  const pinColor = mode === 'pickup' ? PICKUP_COLOR : DROPOFF_COLOR

  // Pin lifts up while dragging, lands back when idle
  const translateY = useSharedValue(0)
  // Pulse ring opacity
  const pulseOpacity = useSharedValue(0.5)
  const pulseScale = useSharedValue(1)

  useEffect(() => {
    if (isDragging) {
      translateY.value = withSpring(-10, { damping: 30, stiffness: 180 })
    } else {
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 })

      // Restart pulse when idle
      pulseOpacity.value = 0.5
      pulseScale.value = 1
      pulseOpacity.value = withRepeat(
        withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      )
      pulseScale.value = withRepeat(
        withTiming(2.2, { duration: 1000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      )
    }
  }, [isDragging])

  const pinStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }))

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }]
  }))

  return (
    // pointerEvents="none" so map gestures pass through the overlay
    <View
      pointerEvents="none"
      className="absolute inset-0 items-center justify-center"
    >
      {/* Pulse ring at ground level */}
      <Animated.View
        style={[
          pulseStyle,
          {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: pinColor,
            position: 'absolute',
            top: '50%',
            marginTop: 10 // align with shadow dot
          }
        ]}
      />

      {/* Shadow ellipse on ground */}
      <View
        style={{
          width: 12,
          height: 6,
          borderRadius: 6,
          backgroundColor: 'rgba(0,0,0,0.18)',
          position: 'absolute',
          top: '50%',
          marginTop: 20
        }}
      />

      {/* The animated pin body */}
      <Animated.View style={[pinStyle, { alignItems: 'center' }]}>
        {/* Pin head */}
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: pinColor,
            borderWidth: 3,
            borderColor: '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 8
          }}
        />
        {/* Pin tail (triangle) */}
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: 6,
            borderRightWidth: 6,
            borderTopWidth: 10,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: pinColor,
            marginTop: -1
          }}
        />
      </Animated.View>
    </View>
  )
}
