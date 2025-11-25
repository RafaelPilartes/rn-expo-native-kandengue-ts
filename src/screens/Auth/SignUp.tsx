// screens/Auth/SignUp.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  Keyboard,
  Alert,
  Image
} from 'react-native'
import { User, Mail, Phone } from 'lucide-react-native'
import PrimaryButton from '@/components/ui/button/PrimaryButton'
import LineGradient from '@/components/LineGradient'
import { AuthStackParamList } from '@/types/navigation'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { InputField } from '@/components/ui/input/InputField'
import ROUTES from '@/constants/routes'
import { useTranslation } from 'react-i18next'
import { LogoRed } from '@/constants/images'
import { useAuthViewModel } from '@/viewModels/AuthViewModel'

export default function SignUpScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>()

  const { t } = useTranslation(['auth', 'common'])

  const navigateTo = (to: any) => {
    navigation.navigate(to)
  }

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  })
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  })
  const [countryCode, setCountryCode] = useState('+244') // Código padrão para Angola

  // handleSubmit para validar antes de navegar
  const validateForm = () => {
    let valid = true
    const newErrors = {
      fullName: '',
      email: '',
      phoneNumber: ''
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = `${t('auth:validate_name_required')}`
      valid = false
    }

    if (!formData.email) {
      newErrors.email = `${t('auth:validate_email_required')}`
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = `${t('auth:validate_email_invalid')}`
      valid = false
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = `${t('auth:validate_phone_required')}`
      valid = false
    } else if (formData.phoneNumber.length < 9) {
      newErrors.phoneNumber = `${t('auth:validate_phone_invalid')}`
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  // handleSubmit para validar antes de navegar
  const handleSubmit = () => {
    if (!validateForm()) return

    try {
      navigation.navigate(ROUTES.AuthStack.CREATE_PASSWORD, {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: `${countryCode}${formData.phoneNumber}`
      })
    } catch (error) {
      console.error('Erro na validação:', error)
      Alert.alert('Erro', 'Ocorreu um erro ao validar os dados')
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
          <View className="flex-1 p-container justify-between">
            <View className="flex-1 mt-4">
              <View className="mb-8">
                <Image
                  source={require('@/assets/logo/png/logo-kandengue-red.png')}
                  style={{ width: 220, height: 60, resizeMode: 'contain' }}
                />
              </View>

              {/* Título */}
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                {t('auth:sign_up')}
              </Text>
              <Text className="text-gray-500 mb-6">
                {t('auth:sign_up_message')}
              </Text>

              {/* Campo Nome Completo */}
              <InputField
                label={`${t('auth:input_name_label')}`}
                icon={
                  <User
                    size={20}
                    color={errors.fullName ? '#ef4444' : '#9ca3af'}
                  />
                }
                placeholder={`${t('auth:input_name_placeholder')}`}
                value={formData.fullName}
                onChangeText={(text: any) =>
                  setFormData({ ...formData, fullName: text })
                }
                error={errors.fullName}
              />

              {/* Campo Email */}
              <InputField
                label={`${t('auth:input_email_label')}`}
                icon={
                  <Mail
                    size={20}
                    color={errors.email ? '#ef4444' : '#9ca3af'}
                  />
                }
                placeholder={`${t('auth:input_email_placeholder')}`}
                value={formData.email}
                onChangeText={(text: any) =>
                  setFormData({ ...formData, email: text })
                }
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              {/* Campo Phone */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  {t('auth:input_phone_label')}
                </Text>
                <View className="flex-row">
                  {/* Código do País */}
                  <View className="w-22 mr-3">
                    <InputField
                      icon={
                        <Phone
                          size={20}
                          color={errors.phoneNumber ? '#ef4444' : '#9ca3af'}
                        />
                      }
                      value={countryCode}
                      onChangeText={setCountryCode}
                      keyboardType="phone-pad"
                      editable={false} // Ou deixar editável se quiser mudar código
                      className="text-center"
                    />
                  </View>

                  {/* Número do Telefone */}
                  <View className="flex-1">
                    <InputField
                      placeholder={`${t('auth:input_phone_placeholder')}`}
                      value={formData.phoneNumber}
                      onChangeText={
                        (text: any) =>
                          setFormData({
                            ...formData,
                            phoneNumber: text.replace(/\D/g, '')
                          }) // Apenas números
                      }
                      keyboardType="numeric"
                      error={errors.phoneNumber}
                      // disabled={isLoading}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Rodapé */}
            <View className="mb-4">
              <PrimaryButton
                label={t('common:buttons.continue')}
                onPress={handleSubmit}
                className="mb-4"
              />

              <View className="flex-row justify-center">
                <Text className="text-gray-500">
                  {t('auth:already_have_account')}?{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => navigateTo(ROUTES.AuthStack.SIGN_IN)}
                >
                  <Text className="text-primary-200 font-semibold">
                    {t('auth:sign_in')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <LineGradient />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
