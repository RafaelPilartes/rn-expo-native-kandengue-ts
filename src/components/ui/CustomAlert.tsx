import React, { useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated'
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info
} from 'lucide-react-native'
import { useAlert } from '../../context/AlertContext'

const getAlertConfig = (type: string) => {
  switch (type) {
    case 'success':
      return { icon: CheckCircle, color: '#10B981', bgClass: 'bg-emerald-50' }
    case 'error':
      return { icon: XCircle, color: '#e0212d', bgClass: 'bg-red-50' }
    case 'warning':
      return { icon: AlertTriangle, color: '#F59E0B', bgClass: 'bg-amber-50' }
    case 'info':
    default:
      return { icon: Info, color: '#3B82F6', bgClass: 'bg-blue-50' }
  }
}

export const CustomAlert = () => {
  const { alertVisible, alertConfig, hideAlert } = useAlert()
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.8)

  useEffect(() => {
    if (alertVisible) {
      opacity.value = withTiming(1, { duration: 150 })
      scale.value = withSpring(1, { damping: 15, stiffness: 200 })
    } else {
      opacity.value = withTiming(0, { duration: 150 })
      scale.value = withTiming(0.8, { duration: 150 })
    }
  }, [alertVisible])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }]
    }
  })

  if (!alertVisible) return null

  const {
    icon: Icon,
    color,
    bgClass
  } = getAlertConfig(alertConfig.type || 'info')

  return (
    <View
      style={StyleSheet.absoluteFillObject}
      className="z-[9999] items-center justify-center bg-slate-900/60"
    >
      <Animated.View
        className="w-[85%] items-center rounded-3xl bg-white p-6 shadow-xl shadow-slate-900/10"
        style={animatedStyle}
      >
        <View
          className={`mb-4 h-16 w-16 items-center justify-center rounded-full ${bgClass}`}
        >
          <Icon size={32} color={color} />
        </View>

        <Text className="mb-2 text-center text-xl font-bold tracking-tight text-slate-900">
          {alertConfig.title}
        </Text>

        <Text className="mb-6 text-center text-[15px] leading-relaxed text-slate-600">
          {alertConfig.message}
        </Text>

        <View className="w-full flex-row justify-center gap-3">
          {alertConfig.buttons && alertConfig.buttons.length > 0 ? (
            alertConfig.buttons.map((btn, index) => {
              const baseButtonClass =
                'flex-1 min-h-[48px] items-center justify-center rounded-xl px-5'
              const baseTextClass = 'text-base font-semibold'

              let buttonClass = `${baseButtonClass} bg-slate-900`
              let textClass = `${baseTextClass} text-white`

              if (btn.style === 'cancel') {
                buttonClass = `${baseButtonClass} bg-slate-100`
                textClass = `${baseTextClass} text-slate-600`
              } else if (btn.style === 'destructive') {
                buttonClass = `${baseButtonClass} border border-red-300 bg-red-50`
                textClass = `${baseTextClass} text-[#e0212d]`
              }

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  onPress={() => {
                    if (btn.onPress) btn.onPress()
                    hideAlert()
                  }}
                  className={buttonClass}
                >
                  <Text className={textClass}>{btn.text}</Text>
                </TouchableOpacity>
              )
            })
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              accessibilityRole="button"
              onPress={hideAlert}
              className="min-h-[48px] flex-1 items-center justify-center rounded-xl px-5"
              style={{ backgroundColor: color }}
            >
              <Text className="text-base font-semibold text-white">OK</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  )
}
