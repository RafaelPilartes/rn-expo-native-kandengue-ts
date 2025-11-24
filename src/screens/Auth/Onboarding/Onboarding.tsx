import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
  ImageBackground
} from 'react-native'
import { AuthStackParamList } from '@/types/navigation'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ROUTES from '@/constants/routes'
import { ArrowRight, Check } from 'lucide-react-native'
import LineGradient from '@/components/LineGradient'
import { useTranslation } from '@/hooks/useTranslation'
import { LogoWhite } from '@/constants/images'
import { useAuthStore } from '@/storage/store/useAuthStore'

export default function Onboarding() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>()
  const { setFirstTime } = useAuthStore()

  const { t } = useTranslation(['onboarding', 'common'])

  const [step, setStep] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const handleComplete = () => {
    console.log('Navigating to permissions...')
    setFirstTime(false)
    navigation.navigate(ROUTES.AuthStack.PERMISSIONS)
  }

  const handleNext = () => {
    if (step < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: step + 1, animated: true })
    } else {
      handleComplete()
    }
  }

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
    )
    setStep(index)
  }

  const renderItem = ({ item }: { item: (typeof onboardingData)[0] }) => (
    <View className="w-screen items-center justify-center p-container">
      <ImageBackground
        source={item.image}
        className="absolute inset-0 flex-1"
        resizeMethod="auto"
        resizeMode="cover"
      />
      <View className="flex-1 justify-end items-center mb-56">
        <Text className="text-4xl font-bold text-center text-white">
          {item.title}
        </Text>
        <Text className="text-center text-gray-100">{item.description}</Text>
      </View>
    </View>
  )

  const onboardingData = [
    {
      id: '1',
      image: require('@/assets/images/onboarding/onboarding1.png'),
      title: 'Confiança em cada entrega',
      description:
        'Estamos aqui para servir com proximidade, garantindo segurança e cuidado do início ao fim.'
    },
    {
      id: '2',
      image: require('@/assets/images/onboarding/onboarding2.png'),
      title: 'Rápido e confiável',
      description:
        'Com estafetas preparados e sempre por perto, a sua entrega chega no tempo certo.'
    },
    {
      id: '3',
      image: require('@/assets/images/onboarding/onboarding3.png'),
      title: 'Juntos, formamos comunidade',
      description:
        'Mais do que entregas, construímos relações e espalhamos boas experiências.'
    }
  ]

  return (
    <View className="flex-1 bg-white">
      {/* Logo */}
      <View className="absolute top-10 left-0 right-0 items-center z-10">
        {/* <Image
          source={LogoWhite}
          style={{ width: 160, height: 65, resizeMode: 'contain' }}
        /> */}
      </View>

      <View className="flex-1">
        {/* Carrossel */}
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
        />

        {/* Botões */}
        <View className="absolute bottom-1 left-0 right-0 flex-row justify-between mt-8 mb-14 px-6">
          {/* Indicadores */}
          <View className="flex-row justify-center items-center mt-2 ">
            {onboardingData.map((_, index) => (
              <View
                key={index}
                className={`w-1 rounded-2xl mx-1 ${
                  index === step ? 'bg-white h-10' : 'border border-white h-6'
                }`}
              />
            ))}
          </View>

          {/* Botão Próximo */}
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={handleNext}
            className={`w-20 h-20 rounded-full items-center justify-center flex-row bg-white `}
            accessibilityRole="button"
          >
            {step === onboardingData.length - 1 ? (
              <Check size={32} color={'#E0212D'} />
            ) : (
              <ArrowRight size={32} color={'#E0212D'} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* line linear gradient */}
      <LineGradient />
    </View>
  )
}
