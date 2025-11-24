import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@/screens/Auth/SignIn';
import { AuthStackParamList } from '../../types/navigation';
import { useAuthStore } from '@/storage/store/useAuthStore';
import LangScreen from '@/screens/Auth/Onboarding/Lang';
import Onboarding from '@/screens/Auth/Onboarding/Onboarding';
import PermissionsScreen from '@/screens/Auth/Onboarding/Permissions';
import WelcomeScreen from '@/screens/Auth/Onboarding/Welcome';
import ROUTES from '@/constants/routes';
import SignUpScreen from '@/screens/Auth/SignUp';
import ForgotPasswordScreen from '@/screens/Auth/ForgotPassword';
import NewPasswordScreen from '@/screens/Auth/NewPassword';
import NewPasswordSuccessScreen from '@/screens/Auth/NewPasswordSuccess';
import CreatePasswordScreen from '@/screens/Auth/CreatePassword';
import ForgotPasswordSuccessScreen from '@/screens/Auth/ForgotPasswordSuccess';
import SmsCodeScreen from '@/screens/Auth/SmsVerification';
import VerificationSuccessScreen from '@/screens/Auth/VerificationSuccess';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthRouter() {
  const { isFirstTime } = useAuthStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={
        isFirstTime ? ROUTES.AuthStack.ONBOARDING : ROUTES.AuthStack.WELCOME
      }
    >
      <Stack.Screen name={ROUTES.AuthStack.LANG} component={LangScreen} />
      <Stack.Screen name={ROUTES.AuthStack.ONBOARDING} component={Onboarding} />
      <Stack.Screen
        name={ROUTES.AuthStack.PERMISSIONS}
        component={PermissionsScreen}
      />
      <Stack.Screen name={ROUTES.AuthStack.WELCOME} component={WelcomeScreen} />
      <Stack.Screen name={ROUTES.AuthStack.SIGN_IN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.AuthStack.SIGN_UP} component={SignUpScreen} />

      <Stack.Screen
        name={ROUTES.AuthStack.SMS_VERIFICATION}
        component={SmsCodeScreen}
      />
      <Stack.Screen
        name={ROUTES.AuthStack.VERIFICATION_SUCCESS}
        component={VerificationSuccessScreen}
      />
      <Stack.Screen
        name={ROUTES.AuthStack.CREATE_PASSWORD}
        component={CreatePasswordScreen}
      />
      <Stack.Screen
        name={ROUTES.AuthStack.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name={ROUTES.AuthStack.FORGOT_PASSWORD_SUCCESS}
        component={ForgotPasswordSuccessScreen}
      />
      <Stack.Screen
        name={ROUTES.AuthStack.NEW_PASSWORD}
        component={NewPasswordScreen}
      />
      <Stack.Screen
        name={ROUTES.AuthStack.NEW_PASSWORD_SUCCESS}
        component={NewPasswordSuccessScreen}
      />
    </Stack.Navigator>
  );
}
