import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';
import ProfileScreen from '@/screens/Main/Profile/Profile';
import ROUTES from '@/constants/routes';
import EditProfileScreen from '@/screens/Main/Profile/EditProfile';
import AboutScreen from '@/screens/Main/Profile/About';
import FaqScreen from '@/screens/Main/Profile/Faq';
import ComplaintsScreen from '@/screens/Main/Profile/Complaints';
import HelpScreen from '@/screens/Main/Profile/Help';
import PrivacyPolicyScreen from '@/screens/Main/Profile/PrivacyPolicy';
import TermsConditionsScreen from '@/screens/Main/Profile/TermsConditions';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileRouter() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name={ROUTES.ProfileStack.PROFILE}
        component={ProfileScreen}
      />
      <Stack.Screen
        name={ROUTES.ProfileStack.EDIT}
        component={EditProfileScreen}
      />
      <Stack.Screen name={ROUTES.ProfileStack.ABOUT} component={AboutScreen} />
      <Stack.Screen name={ROUTES.ProfileStack.FAQ} component={FaqScreen} />
      <Stack.Screen
        name={ROUTES.ProfileStack.COMPLAINTS}
        component={ComplaintsScreen}
      />
      <Stack.Screen name={ROUTES.ProfileStack.HELP} component={HelpScreen} />
      <Stack.Screen
        name={ROUTES.ProfileStack.PRIVATE}
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen
        name={ROUTES.ProfileStack.TERMS}
        component={TermsConditionsScreen}
      />
    </Stack.Navigator>
  );
}
