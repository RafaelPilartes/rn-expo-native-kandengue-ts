import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/types/navigation';
import HomeScreen from '@/screens/Main/Home';
import ROUTES from '@/constants/routes';
import NotificationsScreen from '@/screens/Main/Notifications';
import RideSummaryScreen from '@/screens/Rides/RideSummary';
import RideFinishedScreen from '@/screens/Rides/RideFinished';
import RideChooseScreen from '@/screens/Rides/RideChoose';
import RideHomeScreen from '@/screens/Rides/RideHome';
import RideFlowScreen from '@/screens/Rides/RideFlow';
import RideChatScreen from '@/screens/Rides/RideChat';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeRouter() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name={ROUTES.HomeStack.HOME} component={HomeScreen} />
      <Stack.Screen
        name={ROUTES.HomeStack.NOTIFICATIONS}
        component={NotificationsScreen}
      />

      {/* Legacy screens kept for reference — not registered in nav */}
      {/* RideHome → replaced by RideFlow */}
      <Stack.Screen name={ROUTES.Rides.HOME} component={RideHomeScreen} />
      <Stack.Screen name={ROUTES.Rides.CHOOSE} component={RideChooseScreen} />

      {/* New unified flow */}
      <Stack.Screen name={ROUTES.Rides.FLOW} component={RideFlowScreen} />
      <Stack.Screen name={ROUTES.Rides.SUMMARY} component={RideSummaryScreen} />
      <Stack.Screen
        name={ROUTES.Rides.FINISHED}
        component={RideFinishedScreen}
      />
      <Stack.Screen
        name={ROUTES.Rides.CHAT}
        component={RideChatScreen}
      />
    </Stack.Navigator>
  );
}
