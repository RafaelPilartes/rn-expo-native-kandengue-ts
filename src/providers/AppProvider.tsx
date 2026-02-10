// src/providers/AppProvider.tsx
import React, { createContext, useContext, useCallback, ReactNode } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParamList, MainTabParamList } from '@/types/navigation'
import { RideInterface } from '@/interfaces/IRide'
import { UserInterface } from '@/interfaces/IUser'
import { useAuthStore } from '@/storage/store/useAuthStore'
import ROUTES from '@/constants/routes'
import { useAlert } from '@/context/AlertContext'
import { useUserState } from '../hooks/useUserState'
import { useRidesViewModel } from '@/viewModels/RideViewModel'

interface AppContextReturn {
  // Estado
  currentUserData: UserInterface | null

  // Ações
  handleDetailsRide: (ride: RideInterface) => void
  handleNotifications: () => void
  handleGoBack: () => void

  // Navegação
  navigationHomeStack: NativeStackNavigationProp<HomeStackParamList>
  navigationMainStack: NativeStackNavigationProp<MainTabParamList>
}

const AppContext = createContext<AppContextReturn | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Navegação
  const navigationHomeStack =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>()
  const navigationMainStack =
    useNavigation<NativeStackNavigationProp<MainTabParamList>>()

  // Store
  const { user } = useAuthStore()

  const { showAlert } = useAlert()

  // Estados via Custom Hooks
  const { currentUserData } = useUserState()
  const { fetchRideById } = useRidesViewModel()

  const handleDetailsRide = useCallback(
    async (ride: RideInterface): Promise<void> => {
      if (!ride.id) {
        console.error('❌ ID da corrida não encontrado')
        return
      }
      if (!ride.pickup || !ride.dropoff) {
        showAlert(
          'Erro na localização',
          'A corrida selecionada não possui localização.',
          'error',
          [{ text: 'OK' }]
        )
        return
      }

      // Buscar corrida e verificar status
      const rideById = await fetchRideById(ride.id)

      if (!rideById) {
        showAlert(
          'Erro ao buscar corrida',
          'A corrida selecionada foi excluida ou não existe.',
          'error',
          [{ text: 'OK' }]
        )
        return
      }

      // Navegar para tela de detalhes
      navigationHomeStack.navigate(ROUTES.Rides.SUMMARY, {
        id: ride.id,
        location: {
          pickup: ride.pickup,
          dropoff: ride.dropoff
        },
        receiver: {
          name: ride.details?.receiver.name ?? '',
          phone: ride.details?.receiver.phone ?? ''
        },
        article: {
          type: ride.details?.item.type ?? '',
          description: ride.details?.item.description ?? ''
        }
      })
    },
    [navigationHomeStack, fetchRideById, user?.id, showAlert]
  )

  const handleNotifications = useCallback((): void => {
    navigationHomeStack.navigate(ROUTES.HomeStack.NOTIFICATIONS)
  }, [navigationHomeStack])

  const handleGoBack = useCallback((): void => {
    navigationMainStack.goBack()
  }, [navigationMainStack])

  const value: AppContextReturn = {
    // Estado
    currentUserData,

    // Ações
    handleDetailsRide,
    handleNotifications,
    handleGoBack,

    // Navegação
    navigationHomeStack,
    navigationMainStack
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppProvider = (): AppContextReturn => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppProvider deve ser usado dentro de um AppProvider')
  }
  return context
}
