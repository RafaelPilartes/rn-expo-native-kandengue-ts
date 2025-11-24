import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';

export type CreatePasswordProps = NativeStackScreenProps<
  AuthStackParamList,
  'CreatePasswordScreen'
>;

export type SmsVerificationProps = NativeStackScreenProps<
  AuthStackParamList,
  'SmsVerificationScreen'
>;
