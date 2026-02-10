// src/screens/LoginScreen.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native'
import { Mail, Phone } from 'lucide-react-native'
import PrimaryButton from '@/components/ui/button/PrimaryButton'
import LineGradient from '@/components/LineGradient'
import { InputField } from '@/components/ui/input/InputField'
import { InputPasswordField } from '@/components/ui/input/InputPasswordField'
import { AuthStackParamList } from '@/types/navigation'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ROUTES from '@/constants/routes'
import { useTranslation } from 'react-i18next'
import { LogoRed } from '@/constants/images'
import { useAuthViewModel } from '@/viewModels/AuthViewModel' // ADICIONAR
import { mapFirebaseError } from '@/helpers/mapFirebaseError'
import { useAuthStore } from '@/storage/store/useAuthStore'
import { useUsersViewModel } from '@/viewModels/UserViewModel'
import { UserEntity } from '@/core/entities/User'
import { Image } from 'react-native'
import { useAlert } from '@/context/AlertContext'

export default function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>()

  const { t } = useTranslation(['auth', 'common'])

  const navigateTo = (to: any) => {
    navigation.navigate(to)
  }

  // Hooks principais
  const { login, checkEmailVerification, sendEmailVerification } =
    useAuthViewModel()
  const { showAlert } = useAlert()
  const { updateUser } = useUsersViewModel()
  const { setUser: zustandLogin, logout: zustandLogout } = useAuthStore()

  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  )

  const validateForm = () => {
    let tempErrors: any = {}
    let isValid = true

    if (!email.trim()) {
      tempErrors.email = `${t('auth:validate_email_required')}`
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = `${t('auth:validate_email_invalid')}`
      isValid = false
    }

    if (!password) {
      tempErrors.password = `${t('auth:validate_password_required')}`
      isValid = false
    } else if (password.length < 6) {
      tempErrors.password = `${t('auth:validate_password_characters')}`
      isValid = false
    }

    setErrors(tempErrors)
    return isValid
  }

  // Main login logic
  const handleLogin = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      console.log('🔐 Fazendo login de:', email)

      // 1️⃣ Login via Firebase
      const { user } = await login.mutateAsync({
        email: email.toLowerCase().trim(),
        password
      })

      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      console.log('✅ Login bem-sucedido para', user.email)

      // 2️⃣ Verificar se email foi validado
      const isEmailVerified = await checkEmailVerification.mutateAsync()

      if (!isEmailVerified) {
        console.warn('⚠️ Email não verificado')

        // Mostrar alerta mas permitir acesso
        // Mostrar alerta mas permitir acesso
        showAlert(
          'Email não verificado',
          'Seu email ainda não foi verificado. Verifique seu email e clique no link enviado para ativar sua conta.',
          'warning',
          [
            {
              text: 'Entendi',
              onPress: () => {
                // Navegar para a tela principal mesmo com email não verificado
                navigation.replace(ROUTES.AuthStack.WELCOME)
              }
            },
            {
              text: 'Reenviar Verificação',
              onPress: async () => {
                try {
                  await sendEmailVerification.mutateAsync()
                  showAlert(
                    'Verificação reenviada',
                    `Um novo email foi enviado para ${email}.`,
                    'success'
                  )
                } catch (err) {
                  showAlert(
                    'Erro',
                    'Falha ao reenviar email de verificação.',
                    'error'
                  )
                }
              }
            }
          ]
        )

        // Faz logout até o email ser verificado
        zustandLogout()
        return
      }

      // 3️⃣ Atualiza campo email_verified no Firestore
      try {
        if (user.id) {
          await updateUser.mutateAsync({
            id: user.id,
            user: { email_verified: true }
          })
        } else {
          console.warn(
            '⚠️ user.id ausente — pulando atualização de email_verified'
          )
        }
      } catch (err) {
        console.warn('⚠️ Falha ao atualizar email_verified no Firestore:', err)
      }

      // 4️⃣ Atualiza Zustand e segue para o app
      console.log('✅ User sincronizado localmente.')
      const userEntity = new UserEntity({
        ...user,
        email_verified: true
      })
      zustandLogin(userEntity)
    } catch (error: any) {
      console.error('❌ Erro no login:', error)

      let errorMessage = error.message || 'Erro ao fazer login'

      showAlert('Erro no Login', mapFirebaseError(errorMessage), 'error')

      // LIMPAR: senha em caso de erro
      if (error.message.includes('Senha incorreta')) {
        setPassword('')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white p-safe"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // ajusta se tiver header
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 bg-white p-container justify-start">
            <View className="flex-1 mt-4">
              <View className="mb-8">
                <Image
                  source={require('@/assets/logo/png/logo-kandengue-red.png')}
                  style={{ width: 220, height: 60, resizeMode: 'contain' }}
                />
              </View>

              {/* Título */}
              <Text className="text-3xl font-bold text-black mb-1">
                {t('auth:sign_in')}
              </Text>
              <Text className="text-gray-500 mb-6">
                {t('auth:sign_in_message')}
              </Text>

              {/* Phone Field */}
              {/* ATUALIZAR: Campo Email (em vez de Phone) */}
              <InputField
                label={`${t('auth:input_email_label')}`}
                icon={
                  <Mail
                    size={20}
                    color={errors.email ? '#ef4444' : '#9ca3af'}
                  />
                }
                placeholder={`${t('auth:input_email_placeholder')}`}
                value={email}
                onChangeText={text => setEmail(text.toLowerCase())} // Converter para minúsculo
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                error={errors.email}
              />

              {/* Password Field */}
              <InputPasswordField
                label={`${t('auth:input_password_label')}`}
                placeholder={`${t('auth:input_password_placeholder')}`}
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                onSubmitEditing={handleLogin}
              />

              {/* Esqueceu a senha */}
              <TouchableOpacity
                className="mb-6"
                onPress={() => navigateTo(ROUTES.AuthStack.FORGOT_PASSWORD)}
              >
                <Text className="text-right text-primary-200 text-sm">
                  {t('auth:forgot_password')}?
                </Text>
              </TouchableOpacity>

              {/* Botão */}
              <PrimaryButton
                className="mb-4"
                label={
                  isLoading ? 'Entrando...' : t('common:buttons.sign_in_now')
                }
                onPress={handleLogin}
                disabled={isLoading}
                loading={isLoading}
              />
            </View>

            {/* Rodapé */}
            <View className="flex-row justify-center mb-4">
              <Text className="text-gray-500">{t('auth:no_account')}? </Text>
              <TouchableOpacity
                onPress={() => navigateTo(ROUTES.AuthStack.SIGN_UP)}
              >
                <Text className="text-primary-200 font-semibold">
                  {t('auth:sign_up')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* line linear gradient */}
            <LineGradient />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
