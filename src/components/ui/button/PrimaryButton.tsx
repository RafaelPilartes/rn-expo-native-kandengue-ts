import React from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { DefaultTheme } from '@/styles/theme/DefaultTheme';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

type Props = {
  label: string;
  icon?: LucideIcon; // Componente de ícone opcional
  direction?: 'left' | 'right';
  variant?: ButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string; // overrides adicionais
} & TouchableOpacityProps;

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-200',
  secondary: 'bg-gray-500',
  outline: 'border border-primary-200 bg-transparent',
};

const textVariantStyles: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-white',
  outline: 'text-primary-200',
};

const PrimaryButton: React.FC<Props> = ({
  label,
  icon: Icon,
  variant = 'primary',
  direction = 'left',
  onPress,
  disabled,
  loading,
  className = '',
  ...rest
}) => {
  const bgStyle = variantStyles[variant];
  const textStyle = textVariantStyles[variant];

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      disabled={disabled}
      className={`px-8 py-3 rounded-full items-center justify-center flex-row ${
        disabled ? 'bg-gray-300' : bgStyle
      } ${className}`}
      accessibilityRole="button"
      {...rest}
    >
      {Icon && direction === 'left' && (
        <Icon
          size={20}
          color={disabled ? '#FFF' : variant === 'outline' ? '#246bfd' : '#FFF'}
          style={{ marginRight: label ? 8 : 0 }}
        />
      )}
      {loading && (
        <ActivityIndicator color={DefaultTheme.colors.white} size={18} />
      )}
      {!loading && (
        <Text
          className={` text-base font-semibold ${
            disabled ? 'text-white' : textStyle
          }`}
        >
          {label}
        </Text>
      )}
      {Icon && direction === 'right' && (
        <Icon
          size={20}
          color={
            disabled ? '#9CA3AF' : variant === 'outline' ? '#374151' : '#FFF'
          }
          style={{ marginLeft: label ? 8 : 0 }}
        />
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;
