// screens/Auth/CreatePassword.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native'
import PrimaryButton from '@/components/ui/button/PrimaryButton'
import LineGradient from '@/components/LineGradient'
import { AuthStackParamList } from '@/types/navigation'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { InputPasswordField } from '@/components/ui/input/InputPasswordField'
import ROUTES from '@/constants/routes'
import { BackButton } from '@/components/ui/button/BackButton'
import { CreatePasswordProps } from '@/routers/types/props'
import { useTranslation } from 'react-i18next'
import { useAuthViewModel } from '@/viewModels/AuthViewModel'
import { useAlert } from '@/context/AlertContext'

export default function CreatePasswordScreen({ route }: CreatePasswordProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>()
  const { t } = useTranslation(['auth', 'common'])
  const { showAlert } = useAlert()

  // Usar o hook de autenticação
  const { register } = useAuthViewModel()
  const [isLoading, setIsLoading] = useState(false)

  const { fullName, email, phoneNumber } = route.params

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: ''
  })

  // Validar força da senha
  const validatePasswordStrength = (password: string) => {
    const requirements = {
      minLength: password.length >= 6,
      hasNumber: /\d/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasUpperCase: /[A-Z]/.test(password)
    }

    return requirements
  }

  const handleSubmit = async () => {
    // Validações básicas
    let valid = true
    const newErrors = { password: '', confirmPassword: '' }

    if (!password) {
      newErrors.password = `${t('auth:validate_password_required')}`
      valid = false
    } else if (password.length < 6) {
      newErrors.password = `${t('auth:validate_password_characters')}`
      valid = false
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = `${t('auth:validate_password_no_match')}`
      valid = false
    }

    setErrors(newErrors)

    if (!valid) return

    setIsLoading(true)

    try {
      console.log('Iniciando registro para:', email)

      // const verificationId = await verifyPhone.mutateAsync(phoneNumber);

      // Registrar usuário (já envia verificação por email automaticamente)
      const authResponse = await register.mutateAsync({
        name: fullName,
        email: email,
        phone: phoneNumber,
        password: password
      })

      console.log('authResponse.user ==> ', authResponse.user)
      // Navegar para tela de sucesso
      navigation.replace(ROUTES.AuthStack.VERIFICATION_SUCCESS)
    } catch (error: any) {
      console.error('❌ Erro no registro:', error)

      let errorMessage = error.message || 'Erro ao criar conta'

      // Tratamento de erros específicos
      if (error.message.includes('email já está em uso')) {
        errorMessage =
          'Este email já está cadastrado. Tente fazer login ou use outro email.'
      } else if (error.message.includes('Senha muito fraca')) {
        errorMessage =
          'A senha é muito fraca. Use pelo menos 6 caracteres com letras e números.'
      } else if (error.message.includes('Email inválido')) {
        errorMessage =
          'O formato do email é inválido. Verifique e tente novamente.'
      } else if (error.message.includes('Erro de conexão')) {
        errorMessage =
          'Erro de conexão. Verifique sua internet e tente novamente.'
      }

      showAlert('Erro', errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Obter força da senha para feedback visual
  const passwordStrength = validatePasswordStrength(password)

  const getPasswordStrengthText = () => {
    const metRequirements =
      Object.values(passwordStrength).filter(Boolean).length
    const totalRequirements = Object.keys(passwordStrength).length

    if (password.length === 0) return ''
    if (metRequirements === totalRequirements) return 'Senha forte ✓'
    if (metRequirements >= 3) return 'Senha média'
    return 'Senha fraca'
  }

  const getPasswordStrengthColor = () => {
    const metRequirements =
      Object.values(passwordStrength).filter(Boolean).length
    const totalRequirements = Object.keys(passwordStrength).length

    if (password.length === 0) return 'text-gray-400'
    if (metRequirements === totalRequirements) return 'text-green-600'
    if (metRequirements >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-white p-container m-safe">
          <View className="absolute top-10 left-6 z-10">
            <BackButton />
          </View>

          <View className="mt-24 mb-8">
            <Text className="text-2xl font-bold text-black mb-2">
              {t('auth:create_new_password')}
            </Text>
            <Text className="text-gray-500">
              {t('auth:create_new_password_message')}
            </Text>
          </View>

          <View className="mb-6">
            <InputPasswordField
              label={t('auth:input_password_label')}
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              placeholder={t('auth:input_password_placeholder')}
            />
            {/* Feedback de força da senha */}
            {password.length > 0 && (
              <View className="mt-2">
                <Text
                  className={`text-sm font-medium ${getPasswordStrengthColor()}`}
                >
                  {getPasswordStrengthText()}
                </Text>

                {/* Requisitos da senha */}
                <View className="mt-2 space-y-1">
                  <Text
                    className={`text-xs ${
                      passwordStrength.minLength
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}
                  >
                    • Pelo menos 6 caracteres{' '}
                    {passwordStrength.minLength ? '✓' : ''}
                  </Text>
                  <Text
                    className={`text-xs ${
                      passwordStrength.hasNumber
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}
                  >
                    • Pelo menos 1 número{' '}
                    {passwordStrength.hasNumber ? '✓' : ''}
                  </Text>
                  <Text
                    className={`text-xs ${
                      passwordStrength.hasLowerCase
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}
                  >
                    • Pelo menos 1 letra minúscula{' '}
                    {passwordStrength.hasLowerCase ? '✓' : ''}
                  </Text>
                  <Text
                    className={`text-xs ${
                      passwordStrength.hasUpperCase
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}
                  >
                    • Pelo menos 1 letra maiúscula{' '}
                    {passwordStrength.hasUpperCase ? '✓' : ''}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View className="mb-6">
            <InputPasswordField
              label={t('auth:input_password_confirm_label')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
              placeholder={t('auth:input_password_confirm_placeholder')}
            />
          </View>

          {/* Informações importantes */}
          <View className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Text className="text-blue-800 text-sm font-medium mb-1">
              📧 Verificação por Email
            </Text>
            <Text className="text-blue-700 text-xs">
              Após criar sua conta, enviaremos um email de verificação para{' '}
              {email}. Clique no link do email para ativar sua conta.
            </Text>
          </View>

          <PrimaryButton
            className="mt-6"
            label="Concluir"
            onPress={handleSubmit}
            disabled={isLoading}
            loading={isLoading}
          />

          {/* line linear gradient */}
          <LineGradient />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}
