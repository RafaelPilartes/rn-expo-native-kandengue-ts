import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HistoryStackParamList } from '@/types/navigation';
import History from '@/screens/Main/History/history';
import ROUTES from '@/constants/routes';

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export default function HistoryRouter() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name={ROUTES.HistoryStack.HISTORY} component={History} />
    </Stack.Navigator>
  );
}
