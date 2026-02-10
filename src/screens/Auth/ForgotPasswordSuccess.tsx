import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native'
import { Mail } from 'lucide-react-native'
import PrimaryButton from '@/components/ui/button/PrimaryButton'
import LineGradient from '@/components/LineGradient'
import { InputField } from '@/components/ui/input/InputField'
import { AuthStackParamList } from '@/types/navigation'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ROUTES from '@/constants/routes'
import { BackButton } from '@/components/ui/button/BackButton'
import { useTranslation } from 'react-i18next'
import { useAuthViewModel } from '@/viewModels/AuthViewModel'
import { mapFirebaseError } from '@/helpers/mapFirebaseError'
import { useAlert } from '@/context/AlertContext'

export default function ForgotPasswordScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>()
  const { t } = useTranslation(['auth', 'common'])

  const navigateTo = (to: any) => {
    navigation.reset({
      index: 0,
      routes: [{ name: to }]
    })
  }

  const { forgotPassword } = useAuthViewModel()
  const [isLoading, setIsLoading] = useState(false)
  const { showAlert } = useAlert()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleRecover = async () => {
    // Validação local
    if (!email) {
      setError(`${t('auth:validate_email_required')}`)
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(`${t('auth:validate_email_invalid')}`)
      return
    }

    setError('')
    setIsLoading(true)

    try {
      console.log('Solicitando recuperação para:', email)

      // CHAMAR: Serviço de recuperação de senha
      await forgotPassword
        .mutateAsync(email)
        .then(() => {
          console.log('✅ Email de recuperação enviado com sucesso')

          // NAVEGAR: Para tela de sucesso
          navigation.navigate(ROUTES.AuthStack.FORGOT_PASSWORD_SUCCESS)
        })
        .catch((error: any) => {
          console.error('❌ Erro ao solicitar recuperação:', error)

          // TRATAMENTO: De erros específicos
          let errorMessage =
            mapFirebaseError(error) || 'Erro ao enviar email de recuperação'

          showAlert('Erro ao solicitar recuperação', errorMessage, 'error')
        })
    } catch (error: any) {
      console.error('❌ Erro ao solicitar recuperação:', error)

      // TRATAMENTO: De erros específicos
      let errorMessage =
        mapFirebaseError(error) || 'Erro ao enviar email de recuperação'

      showAlert('Erro ao solicitar recuperação', errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Limpar erro quando o usuário digitar
  const handleEmailChange = (text: string) => {
    setEmail(text.toLowerCase()) // Converter para minúsculo
    if (error) setError('') // Limpar erro quando usuário começar a digitar
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-white p-container">
          <View className="absolute top-10 left-6 z-10">
            <BackButton />
          </View>

          <View className="mt-24 mb-8">
            <Text className="text-2xl font-bold text-black mb-2">
              {t('auth:forgot_password')}
            </Text>
            <Text className="text-gray-500">
              {t('auth:forgot_password_message')}
            </Text>
          </View>

          <InputField
            label={t('auth:input_email_label')}
            icon={<Mail size={20} color={error ? '#ef4444' : '#9ca3af'} />}
            placeholder={t('auth:input_email_placeholder')}
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={error}
            editable={!isLoading}
            onSubmitEditing={handleRecover}
          />

          <PrimaryButton
            className="mt-6"
            label={t('common:buttons.recover')}
            onPress={handleRecover}
            disabled={isLoading}
            loading={isLoading}
          />

          <TouchableOpacity
            className="mt-4 self-start"
            onPress={() => navigateTo(ROUTES.AuthStack.SIGN_IN)}
          >
            <Text className="text-primary-200">
              {t('auth:remember_password')}?{' '}
              <Text className="font-semibold">
                {t('common:buttons.sign_in')}
              </Text>
            </Text>
          </TouchableOpacity>

          <View className="flex-1 justify-end mb-4">
            <TouchableOpacity
              className="self-center"
              onPress={() => navigateTo(ROUTES.AuthStack.SIGN_UP)}
            >
              <Text className="text-gray-500">
                {t('auth:no_account')}?{' '}
                <Text className="text-primary-200 font-semibold">
                  {t('common:buttons.sign_up')}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* line linear gradient */}
          <LineGradient />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}
