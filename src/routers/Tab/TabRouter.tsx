import React from 'react'
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs'
import { MainTabParamList } from '../../types/navigation'
import HomeRouter from '../navigation/HomeRouter'
import HistoryRouter from '../navigation/HistoryRouter'
import ProfileRouter from '../navigation/ProfileRouter'
import { Calendar, Clock, Home, User2 } from 'lucide-react-native'
import ROUTES from '@/constants/routes'
import { useAuthViewModel } from '@/viewModels/AuthViewModel'
import { makeTabOptions } from '@/utils/makeTabOptions'
import LoadingScreen from '@/screens/Loading'

const Tab = createBottomTabNavigator<MainTabParamList>()

const hiddenHomeTabRoutes = [
  ROUTES.Rides.HOME,
  ROUTES.Rides.CHOOSE,
  ROUTES.Rides.SUMMARY,
  ROUTES.Rides.FINISHED,
  ROUTES.HomeStack.NOTIFICATIONS
]
const hiddenHistoryTabRoutes = [ROUTES.HistoryStack.HISTORY_DETAILS]
const hiddenProfileTabRoutes = [
  ROUTES.ProfileStack.EDIT,
  ROUTES.ProfileStack.ABOUT,
  ROUTES.ProfileStack.FAQ,
  ROUTES.ProfileStack.HELP,
  ROUTES.ProfileStack.COMPLAINTS,
  ROUTES.ProfileStack.PRIVATE,
  ROUTES.ProfileStack.TERMS
]

export default function TabRouter() {
  const { isLoading } = useAuthViewModel()

  // 🔸 Bloquear UI enquanto usuário carrega
  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarItemStyle: { borderColor: '#1c1c1c50' },
        tabBarActiveTintColor: '#E0212D',
        tabBarInactiveTintColor: '#999',

        tabBarLabelStyle: {
          fontSize: 11, // Tamanho da fonte do label
          marginBottom: 4 // Espaçamento abaixo do texto
        },
        tabBarIconStyle: {
          marginTop: 8 // Espaçamento acima do ícone
        }
      }}
      initialRouteName="HomeTab"
      backBehavior="firstRoute"
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeRouter}
        options={({ route }) =>
          makeTabOptions(
            route,
            ROUTES.HomeStack.HOME,
            hiddenHomeTabRoutes,
            'Início',
            Home
          ) as BottomTabNavigationOptions
        }
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryRouter}
        options={({ route }) =>
          makeTabOptions(
            route,
            ROUTES.HistoryStack.HISTORY,
            hiddenHistoryTabRoutes,
            'Histórico',
            Calendar
          ) as BottomTabNavigationOptions
        }
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileRouter}
        options={({ route }) =>
          makeTabOptions(
            route,
            ROUTES.ProfileStack.PROFILE,
            hiddenProfileTabRoutes,
            'Perfil',
            User2
          ) as BottomTabNavigationOptions
        }
      />
    </Tab.Navigator>
  )
}
