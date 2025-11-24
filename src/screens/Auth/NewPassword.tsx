import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Lock } from 'lucide-react-native';
import PrimaryButton from '@/components/ui/button/PrimaryButton';
import LineGradient from '@/components/LineGradient';
import { AuthStackParamList } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InputPasswordField } from '@/components/ui/input/InputPasswordField';
import ROUTES from '@/constants/routes';
import { BackButton } from '@/components/ui/button/BackButton';
import { useTranslation } from 'react-i18next';

export default function NewPasswordScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { t } = useTranslation(['auth', 'common']);

  const navigateTo = (to: any) => {
    navigation.navigate(to);
  };

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = () => {
    let valid = true;
    const newErrors = { password: '', confirmPassword: '' };

    if (!password) {
      newErrors.password = `${t('auth:validate_password_required')}`;
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = `${t('auth:validate_password_characters')}`;
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = `${t('auth:validate_password_no_match')}`;
      valid = false;
    }

    setErrors(newErrors);
    if (valid) {
      navigateTo(ROUTES.AuthStack.NEW_PASSWORD_SUCCESS);
    }
  };

  return (
    <View className="flex-1 bg-white p-container">
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

      <InputPasswordField
        label={t('auth:input_password_new_label')}
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        placeholder={t('auth:input_password_new_placeholder')}
      />

      <InputPasswordField
        label={t('auth:input_password_confirm_label')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={errors.confirmPassword}
        placeholder={t('auth:input_password_confirm_placeholder')}
      />

      <PrimaryButton className="mt-6" label="Concluir" onPress={handleSubmit} />

      {/* line linear gradient */}
      <LineGradient />
    </View>
  );
}
