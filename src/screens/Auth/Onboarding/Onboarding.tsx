import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  useWindowDimensions,
  StyleSheet
} from 'react-native'
import { AuthStackParamList } from '@/types/navigation'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ROUTES from '@/constants/routes'
import { ArrowRight, Check } from 'lucide-react-native'
import LineGradient from '@/components/LineGradient'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStore } from '@/storage/store/useAuthStore'
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
  withTiming,
  useAnimatedRef,
  runOnJS,
  SharedValue
} from 'react-native-reanimated'
import {
  OnboardingOne,
  OnboardingTwo,
  OnboardingThree
} from '@/constants/images'

const onboardingData = [
  {
    id: '1',
    image: OnboardingOne,
    title: 'Confiança em cada entrega',
    description:
      'Estamos aqui para servir com proximidade, garantindo segurança e cuidado do início ao fim.'
  },
  {
    id: '2',
    image: OnboardingTwo,
    title: 'Rápido e confiável',
    description:
      'Com estafetas preparados e sempre por perto, a sua entrega chega no tempo certo.'
  },
  {
    id: '3',
    image: OnboardingThree,
    title: 'Juntos, formamos comunidade',
    description:
      'Mais do que entregas, construímos relações e espalhamos boas experiências.'
  }
]

const OnboardingItem = ({
  item,
  index,
  scrollX,
  width
}: {
  item: (typeof onboardingData)[0]
  index: number
  scrollX: SharedValue<number>
  width: number
}) => {
  const rnStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP
    )

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [50, 0, 50],
      Extrapolation.CLAMP
    )

    return {
      opacity,
      transform: [{ translateY }]
    }
  })

  const bgStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

    // Reduced parallax movement to avoid excessive zooming
    // Multiplier 1.1 -> range +/- 0.05 * width
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [-width * 0.05, 0, width * 0.05],
      Extrapolation.CLAMP
    )

    return {
      transform: [
        { translateX },
        { translateX: -(width * 1.1 - width) / 2 } // Center the 1.1x wide image
      ]
    }
  })

  return (
    <View
      style={{ width, flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
        <Animated.Image
          source={item.image}
          style={[{ flex: 1, width: width * 1.1, height: '100%' }, bgStyle]}
          resizeMode="cover"
        />
      </View>

      {/* Overlay Gradient/Darken if needed, usually built into image or separate view */}
      <View className="absolute inset-0 bg-black/20" />

      <Animated.View
        style={[
          rnStyle,
          {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 220,
            paddingHorizontal: 30
          }
        ]}
      >
        <Text className="text-4xl font-bold text-center text-white mb-4">
          {item.title}
        </Text>
        <Text className="text-center text-gray-100 text-base leading-6">
          {item.description}
        </Text>
      </Animated.View>
    </View>
  )
}

const Paginator = ({
  data,
  scrollX,
  width
}: {
  data: typeof onboardingData
  scrollX: SharedValue<number>
  width: number
}) => {
  return (
    <View className="flex-row justify-center items-center">
      {data.map((_, i) => {
        const rStyle = useAnimatedStyle(() => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width]

          const dotWidth = interpolate(
            scrollX.value,
            inputRange,
            [8, 24, 8],
            Extrapolation.CLAMP
          )

          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.5, 1, 0.5],
            Extrapolation.CLAMP
          )

          const height = interpolate(
            scrollX.value,
            inputRange,
            [8, 8, 8],
            Extrapolation.CLAMP
          )

          return {
            width: dotWidth,
            opacity,
            height
          }
        })

        return (
          <Animated.View
            key={i.toString()}
            style={[
              {
                borderRadius: 4,
                marginHorizontal: 4,
                backgroundColor: 'white'
              },
              rStyle
            ]}
          />
        )
      })}
    </View>
  )
}

export default function Onboarding() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>()
  const { setFirstTime } = useAuthStore()
  const { width } = useWindowDimensions()

  // const { t } = useTranslation(['onboarding', 'common']) // Keeping logic but unused for now

  const flatListRef = useAnimatedRef<FlatList>()
  const scrollX = useSharedValue(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleComplete = () => {
    setFirstTime(false)
    navigation.navigate(ROUTES.AuthStack.PERMISSIONS)
  }

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      })
    } else {
      handleComplete()
    }
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x
    },
    onMomentumEnd: event => {
      const index = Math.round(event.contentOffset.x / width)
      runOnJS(setCurrentIndex)(index)
    }
  })

  // Button Animation
  const buttonStyle = useAnimatedStyle(() => {
    // Scale or styling changes based on index if needed
    return {
      transform: [{ scale: withSpring(1) }] // Example placebo
    }
  })

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <Animated.FlatList
          ref={flatListRef}
          data={onboardingData}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <OnboardingItem
              item={item}
              index={index}
              scrollX={scrollX}
              width={width}
            />
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          bounces={false}
        />

        <View className="absolute bottom-20 left-0 right-0 px-8 flex-row justify-between items-center">
          <Paginator data={onboardingData} scrollX={scrollX} width={width} />

          <TouchableOpacity activeOpacity={0.8} onPress={handleNext}>
            <Animated.View
              style={[buttonStyle]}
              className="w-16 h-16 rounded-full bg-white items-center justify-center shadow-lg"
            >
              {currentIndex === onboardingData.length - 1 ? (
                <Check size={28} color="#E0212D" strokeWidth={3} />
              ) : (
                <ArrowRight size={28} color="#E0212D" strokeWidth={3} />
              )}
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      <LineGradient />
    </View>
  )
}
