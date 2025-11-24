import React, { useCallback, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { LangEnIcon, LangFrIcon, LangPtIcon } from '@/constants/icons';
import LanguageCard from '@/components/ui/card/LanguageCard';
import PrimaryButton from '@/components/ui/button/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '@/types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ROUTES from '@/constants/routes';
import LineGradient from '@/components/LineGradient';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageEnum } from '@/types/enum';
import { BackButton } from '@/components/ui/button/BackButton';

type Language = {
  id: LanguageEnum;
  name: string;
  nativeName: string;
  icon: React.ReactNode;
};

const LangScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const { t, changeLanguage, currentLanguage } = useTranslation([
    'onboarding',
    'common',
  ]);

  const [selected, setSelected] = useState(currentLanguage);

  const goToNextStep = () => {
    navigation.navigate(ROUTES.AuthStack.ONBOARDING);
  };

  const handleSelect = useCallback((id: string) => {
    setSelected(id);
    changeLanguage(id as LanguageEnum);
  }, []);

  const languages: Language[] = [
    {
      id: 'pt',
      name: `${t('onboarding:select_lang_pt')}`,
      nativeName: `${t('onboarding:select_lang_native_pt')}`,
      icon: <LangPtIcon width={32} height={32} />,
    },
    {
      id: 'en',
      name: `${t('onboarding:select_lang_en')}`,
      nativeName: `${t('onboarding:select_lang_native_en')}`,
      icon: <LangEnIcon width={32} height={32} />,
    },
    {
      id: 'fr',
      name: `${t('onboarding:select_lang_fr')}`,
      nativeName: `${t('onboarding:select_lang_native_fr')}`,
      icon: <LangFrIcon width={32} height={32} />,
    },
  ] as const;

  return (
    <View className="flex-1 bg-white p-5">
      <View className="absolute top-10 left-6 z-10">
        <BackButton />
      </View>

      <View className="mt-24 mb-8">
        <Text className="text-2xl font-bold mt-4">
          {t('onboarding:select_lang')}
        </Text>
        <Text className="text-center text-gray-500 mt-1">
          {t('onboarding:permissions_description')}
        </Text>
      </View>

      <ScrollView className="flex-1">
        {languages.map(lang => (
          <LanguageCard
            key={lang.id}
            data={lang}
            selected={selected}
            onSelect={() => handleSelect(lang.id)}
          />
        ))}
      </ScrollView>

      <PrimaryButton
        className="mb-8"
        label={t('common:buttons.conclude')}
        onPress={goToNextStep}
      />

      {/* line linear gradient */}
      <LineGradient />
    </View>
  );
};

export default LangScreen;
