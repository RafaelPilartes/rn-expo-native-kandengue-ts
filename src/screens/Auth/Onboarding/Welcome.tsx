import LineGradient from '@/components/LineGradient'
import PrimaryButton from '@/components/ui/button/PrimaryButton'
import { BgWave, LogoRed } from '@/constants/images'
import ROUTES from '@/constants/routes'
import { AuthStackParamList } from '@/types/navigation'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import { View, Text, Image } from 'react-native'

export default function WelcomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>()
  const { t } = useTranslation(['auth', 'common'])

  const navigateTo = (to: any) => {
    navigation.navigate(to)
  }

  return (
    <View className="flex-1 justify-end bg-white p-container">
      {/* Logo */}
      <View className="mt-12 mb-6">
        <Image
          source={require('@/assets/logo/png/logo-kandengue-red.png')}
          style={{ width: 220, height: 60, resizeMode: 'contain' }}
        />
      </View>

      <View className="items-start my-6">
        <Text className="text-4xl text-primary-200 font-extrabold mt-2">
          Bem-vindo!
        </Text>
        <Text className="text-gray-500 text-start text-lg mt-4 mb-6">
          Conecte-se para continuar explorando o Kandengue Atrevido.
        </Text>
      </View>

      <PrimaryButton
        className="mb-4"
        label={`${t('common:buttons.sign_in')}`}
        onPress={() => navigateTo(ROUTES.AuthStack.SIGN_IN)}
      />
      <PrimaryButton
        className="mb-safe"
        label={`${t('common:buttons.sign_up')}`}
        variant="outline"
        onPress={() => navigateTo(ROUTES.AuthStack.SIGN_UP)}
      />

      {/* <View className="absolute top-0 left-0 right-0">
        <BgWave width={500} height={300} />
      </View> */}
    </View>
  )
}
