// screens/Auth/SmsVerification.tsx
import LineGradient from '@/components/LineGradient'
import { BackButton } from '@/components/ui/button/BackButton'
import PrimaryButton from '@/components/ui/button/PrimaryButton'
import ROUTES from '@/constants/routes'
import { SmsVerificationProps } from '@/routers/types/props'
import { RootStackParamList } from '@/types/navigation'
import { useAuthViewModel } from '@/viewModels/AuthViewModel'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native'

const PIN_LENGTH = 5

export default function SmsVerificationScreen({ route }: SmsVerificationProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { t } = useTranslation(['auth', 'common'])

  const {
    register
    // confirmPhoneVerification,
    // resendPhoneVerification,
    // verificationSession,
    // clearVerificationSession,
  } = useAuthViewModel()

  const { fullName, email, phoneNumber, password } = route.params

  const navigateTo = (to: any) => {
    navigation.navigate(to)
  }

  const inputRef = useRef<TextInput>(null)
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(45)
  const [isResendDisabled, setIsResendDisabled] = useState(true)

  const currentIndex = code.length

  // CORREÇÃO: useEffect para limpar sessão ao desmontar
  useEffect(() => {
    return () => {
      // Limpar sessão quando sair da tela
      // clearVerificationSession();
    }
  }, [])

  const handleChange = (value: string) => {
    // Apenas números e até o tamanho máximo
    const cleanValue = value.replace(/[^0-9]/g, '').slice(0, PIN_LENGTH)
    setCode(cleanValue)
  }

  const handlePressBox = () => {
    // Força reabrir o teclado mesmo se tiver sido fechado manualmente
    inputRef.current?.blur()
    setTimeout(() => {
      inputRef.current?.focus()
    }, 50)
  }

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setIsResendDisabled(false)
    }
  }, [countdown])

  const handleResend = () => {
    if (!isResendDisabled) {
      // Lógica para reenviar SMS
      setCountdown(45)
      setIsResendDisabled(true)
      // alert('Código reenviado com sucesso!');
    }
  }

  const handleVerify = () => {
    if (code.length === 5) {
      // Lógica para verificar o código
      // navigateTo(ROUTES.AuthStack.SMS_VERIFICATION_SUCCESS);
    } else {
      // alert('Por favor, digite o código completo');
    }
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

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 justify-between mt-24"
          >
            <View className="flex-1 flex-col gap-4">
              {/* Título */}
              <View className="mt-4">
                <Text className="text-3xl font-bold text-gray-900">
                  {t('auth:sms_sent')}
                </Text>

                {/* Mensagem com número */}
                <View className="items-start">
                  <Text className="text-gray-500 text-center mb-1">
                    {t('auth:enter_security_code')}
                  </Text>
                  <Text className="font-medium text-gray-500">
                    {phoneNumber}
                  </Text>
                </View>
              </View>

              {/* Campo PIN */}
              <TouchableOpacity
                activeOpacity={1}
                onPress={handlePressBox}
                className="mt-6"
              >
                <View className="flex-row justify-between">
                  {Array.from({ length: PIN_LENGTH }).map((_, idx) => {
                    const filled = idx < code.length
                    const isActive = idx === currentIndex
                    return (
                      <View
                        key={idx}
                        className={`w-16 h-16 rounded-lg items-center justify-center border ${
                          isActive ? 'border-blue-500' : 'border-gray-300'
                        }`}
                      >
                        <Text className="text-2xl font-semibold">
                          {filled ? '•' : ''}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              </TouchableOpacity>

              {/* Input invisível */}
              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={handleChange}
                keyboardType="number-pad"
                maxLength={PIN_LENGTH}
                autoFocus
                style={{ position: 'absolute', opacity: 0 }}
              />

              {/* Reenviar código */}
              <TouchableOpacity
                onPress={handleResend}
                disabled={isResendDisabled}
                className="items-start mb-8"
              >
                <Text
                  className={`text-center ${
                    isResendDisabled ? 'text-gray-400' : 'text-primary-200'
                  }`}
                >
                  {t('auth:did_not_receive_code')}?{' '}
                  <Text className="font-semibold">
                    {t('auth:resend')} {isResendDisabled && `(${countdown}s)`}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Botão confirmar */}
            <PrimaryButton
              className="mb-8"
              disabled={code.length < PIN_LENGTH}
              label={t('common:buttons.verify')}
              onPress={handleVerify}
            />
          </KeyboardAvoidingView>

          {/* line linear gradient */}
          <LineGradient />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}
