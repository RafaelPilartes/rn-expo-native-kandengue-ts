import React from 'react';
import { View, Text } from 'react-native';
import PrimaryButton from '@/components/ui/button/PrimaryButton';
import LineGradient from '@/components/LineGradient';
import { AuthStackParamList } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SuccessCircule } from '@/constants/icons';
import ROUTES from '@/constants/routes';
import { useTranslation } from 'react-i18next';

export default function SmsVerificationSuccessScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { t } = useTranslation(['auth', 'common']);

  const navigateTo = (to: any) => {
    navigation.navigate(to);
  };

  return (
    <View className="flex-1 flex items-center justify-center p-container">
      <View className="items-center mt-16 mb-8">
        <View className="mb-6">
          <SuccessCircule width={120} height={120} />
        </View>

        <Text className="text-3xl font-bold text-black mb-2">
          {t('auth:success')}
        </Text>
        <Text className="text-lg text-gray-500 text-center px-8">
          {t('auth:success_sms_message')}
        </Text>
      </View>

      <PrimaryButton
        className="w-72 mb-12"
        label={`${t('common:buttons.continue')}`}
        onPress={() => navigateTo(ROUTES.AuthStack.WELCOME)}
      />

      {/* line linear gradient */}
      <LineGradient />
    </View>
  );
}
