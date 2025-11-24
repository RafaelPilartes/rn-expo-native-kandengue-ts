// src/components/form/InputPasswordField.tsx
import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
import { InputField } from './InputField';
import type { TextInputProps } from 'react-native';

interface InputPasswordFieldProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

export const InputPasswordField = ({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  keyboardType,
  ...props
}: InputPasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputField
      label={label}
      value={value}
      onChangeText={onChangeText}
      error={error}
      placeholder={placeholder}
      keyboardType={keyboardType || 'default'}
      secureTextEntry={showPassword}
      icon={<Lock size={20} color={error ? '#ef4444' : '#9ca3af'} />}
      rightIcon={
        !showPassword ? (
          <EyeOff size={20} color="#9ca3af" />
        ) : (
          <Eye size={20} color="#9ca3af" />
        )
      }
      onClickIcon={() => setShowPassword(!showPassword)}
      {...props}
    />
  );
};
