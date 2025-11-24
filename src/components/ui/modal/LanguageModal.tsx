// components/modals/LanguageModal.tsx
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageModalProps {
  visible: boolean;
  languages: Language[];
  selectedLanguage: Language;
  onSelect: (lang: Language) => void;
  onClose: () => void;
}

const LanguageItem = React.memo(
  ({
    lang,
    isSelected,
    onPress,
  }: {
    lang: Language;
    isSelected: boolean;
    onPress: (lang: Language) => void;
  }) => {
    return (
      <TouchableOpacity
        className={`flex-row items-center px-4 py-3 ${
          isSelected ? 'bg-blue-50' : ''
        }`}
        onPress={() => onPress(lang)}
      >
        <Text className="text-2xl mr-3">{lang.flag}</Text>
        <Text className="flex-1 text-gray-800 font-medium">{lang.name}</Text>
        {isSelected && <Check size={20} color="#3b82f6" />}
      </TouchableOpacity>
    );
  },
);

export const LanguageModal = ({
  visible,
  languages,
  selectedLanguage,
  onSelect,
  onClose,
}: LanguageModalProps) => {
  const { t } = useTranslation('onboarding');

  const handleSelect = useCallback(
    (lang: Language) => {
      onSelect(lang);
      onClose();
    },
    [onSelect, onClose],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/30 justify-center items-center"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="bg-white rounded-xl w-4/5 max-w-md pb-4 overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-900">
              {t('onboarding:select_lang')}
            </Text>
          </View>

          <FlatList
            data={languages}
            keyExtractor={item => item.code}
            renderItem={({ item }) => (
              <LanguageItem
                lang={item}
                isSelected={selectedLanguage.code === item.code}
                onPress={handleSelect}
              />
            )}
            style={{ maxHeight: '70%' }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
