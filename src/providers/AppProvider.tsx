// src/providers/HomeProvider.ts
import { useState, useEffect, useCallback, use } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList, MainTabParamList } from '@/types/navigation';
import { RideInterface } from '@/interfaces/IRide';
import { UserInterface } from '@/interfaces/IUser';
import { useUsersViewModel } from '@/viewModels/UserViewModel';
import { useRidesViewModel } from '@/viewModels/RideViewModel';
import { useAuthStore } from '@/storage/store/useAuthStore';
import ROUTES from '@/constants/routes';
import { WalletInterface } from '@/interfaces/IWallet';
import { Alert } from 'react-native';
import { useVehiclesViewModel } from '@/viewModels/VehicleViewModel';
import { VehicleInterface } from '@/interfaces/IVehicle';

interface AppContextReturn {
  // Estado
  currentUserData: UserInterface | null;

  // Ações
  handleDetailsRide: (ride: RideInterface) => void;
  handleNotifications: () => void;
  handleGoBack: () => void;

  // Navegação
  navigationHomeStack: NativeStackNavigationProp<HomeStackParamList>;
  navigationMainStack: NativeStackNavigationProp<MainTabParamList>;
}

export const useAppProvider = (): AppContextReturn => {
  // Navegação
  const navigationHomeStack =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const navigationMainStack =
    useNavigation<NativeStackNavigationProp<MainTabParamList>>();

  // Store e ViewModels
  const { user, setCurrentMissionId } = useAuthStore();
  const { listenUserRealtime, updateUser } = useUsersViewModel();
  const { fetchAllVehiclesByField } = useVehiclesViewModel();

  const {
    listenAllByField: listenAllRidesByField,
    fetchRideById,
    fetchAllRidesByField,
  } = useRidesViewModel();

  // Estado local
  // User
  const [currentUserData, setCurrentUserData] = useState<UserInterface | null>(
    user,
  );

  // Listeners em tempo real
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribeUser = listenUserRealtime(user.id, setCurrentUserData);

    return unsubscribeUser;
  }, [user?.id, listenUserRealtime]);

  // Ações
  const handleDetailsRide = useCallback(
    async (ride: RideInterface): Promise<void> => {
      if (!ride.id) {
        console.error('❌ ID da corrida não encontrado');
        return;
      }
      if (!ride.pickup || !ride.dropoff) {
        Alert.alert(
          'Erro na localização',
          'A corrida selecionada não possui localização.',
          [{ text: 'OK' }],
        );
        return;
      }

      // Buscar corrida e verificar status
      const rideById = await fetchRideById(ride.id);

      if (!rideById) {
        Alert.alert(
          'Erro ao buscar corrida',
          'A corrida selecionada foi excluida ou não existe.',
          [{ text: 'OK' }],
        );
        return;
      }

      if (rideById.status !== 'idle') {
        if (rideById.user?.id !== user?.id) {
          Alert.alert(
            'Corrida indisponível',
            'A corrida selecionada já não está disponível.',
            [{ text: 'OK' }],
          );
          setCurrentMissionId(null);
          return;
        }
      }

      // Navegar para tela de detalhes
      navigationHomeStack.navigate(ROUTES.Rides.SUMMARY, {
        id: ride.id,
        location: {
          pickup: ride.pickup,
          dropoff: ride.dropoff,
        },
        receiver: {
          name: ride.details?.receiver.name ?? '',
          phone: ride.details?.receiver.phone ?? '',
        },
        article: {
          type: ride.details?.item.type ?? '',
          description: ride.details?.item.description ?? '',
        },
      });
    },
    [navigationHomeStack],
  );

  const handleNotifications = useCallback((): void => {
    navigationHomeStack.navigate(ROUTES.HomeStack.NOTIFICATIONS);
  }, [navigationMainStack]);

  const handleGoBack = useCallback((): void => {
    navigationMainStack.goBack();
  }, [navigationMainStack]);

  return {
    // Estado
    currentUserData,

    // Ações
    handleDetailsRide,
    handleNotifications,
    handleGoBack,

    // Navegação
    navigationHomeStack,
    navigationMainStack,
  };
};
