import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

type Props = {
  data: {
    id: string;
    icon?: React.ReactNode; // agora pode ser um componente JSX
    name: string;
    nativeName: string;
  };
  selected: string;
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
} & TouchableOpacityProps;

const LanguageCard: React.FC<Props> = ({
  data,
  selected,
  onSelect,
  disabled,
  className = '',
  ...rest
}) => {
  const isActive = selected === data.id;

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      className={`flex-row items-center p-3 rounded-xl mb-3 border ${
        isActive ? 'border-primary-200' : 'border-gray-300'
      } ${className}`}
      onPress={onSelect}
      disabled={disabled}
      accessibilityRole="button"
      {...rest}
    >
      {data.icon && <View className="mr-3">{data.icon}</View>}
      <Text className="flex-1 font-medium">{data.name}</Text>
      <Text className="text-gray-500">{data.nativeName}</Text>
    </TouchableOpacity>
  );
};

export default LanguageCard;
