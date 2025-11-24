import React, { JSX, useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  Platform,
  Linking
} from 'react-native'
import PermissionCard from '@/components/ui/card/PermissionCard'
import PrimaryButton from '@/components/ui/button/PrimaryButton'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '@/types/navigation'
import ROUTES from '@/constants/routes'
import LineGradient from '@/components/LineGradient'
import { useTranslation } from 'react-i18next'
import { Check, Mic, Navigation, X } from 'lucide-react-native'
import { usePermissionsStore } from '@/storage/store/usePermissionsStore'
import {
  checkLocationPermission,
  LocationPermissionResponse,
  requestLocationPermission
} from '@/services/permissions/locationPermission'
import {
  checkNotificationPermission,
  NotificationPermissionResponse,
  requestNotificationPermission
} from '@/services/permissions/notificationPermission'

type PermissionStatus = 'pending' | 'granted' | 'denied' | 'blocked'

interface PermissionItem {
  id: 'location' | 'notifications'
  icon: JSX.Element
  title: string
  description: string
  status: PermissionStatus
}

const Permissions = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>()

  const { setPermissionsSeen } = usePermissionsStore()

  const { t } = useTranslation(['onboarding', 'common'])

  const [permissions, setPermissions] = useState<PermissionItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Verificar status atual das permissões
  const checkAllPermissions = async () => {
    try {
      const locationStatus = await checkLocationPermission()
      const notificationStatus = await checkNotificationPermission()

      setPermissions([
        {
          id: 'location',
          icon: <Navigation size={24} color="#3B82F6" />,
          title: t('onboarding:permissions_title_1'),
          description: t('onboarding:permissions_description_1'),
          status: mapLocationStatus(locationStatus)
        },
        {
          id: 'notifications',
          icon: <Mic size={24} color="#3B82F6" />,
          title: t('onboarding:permissions_title_2'),
          description: t('onboarding:permissions_description_2'),
          status: mapNotificationStatus(notificationStatus)
        }
      ])
    } catch (error) {
      console.error('Erro ao verificar permissões:', error)
    }
  }

  // Mapear status da localização
  const mapLocationStatus = (
    status: LocationPermissionResponse
  ): PermissionStatus => {
    if (status.granted) return 'granted'
    if (status.denied) return 'denied'
    if (status.blocked) return 'blocked'
    return 'pending'
  }

  // Mapear status das notificações
  const mapNotificationStatus = (
    status: NotificationPermissionResponse
  ): PermissionStatus => {
    if (status.granted) return 'granted'
    if (status.denied) return 'denied'
    if (status.blocked) return 'blocked'
    return 'pending'
  }

  // Solicitar permissão individual
  const requestPermission = async (
    permissionId: 'location' | 'notifications'
  ) => {
    try {
      setIsLoading(true)

      let result
      if (permissionId === 'location') {
        result = await requestLocationPermission()
      } else {
        result = await requestNotificationPermission()
      }

      // Atualizar status da permissão
      await checkAllPermissions()

      // Mostrar feedback baseado no resultado
      if (result.granted) {
        showPermissionGrantedFeedback(permissionId)
      } else if (result.denied || result.blocked) {
        showPermissionDeniedFeedback(permissionId)
      }
    } catch (error) {
      console.error(`Erro ao solicitar permissão ${permissionId}:`, error)
      Alert.alert('Erro', 'Erro na solicitação da permissão')
    } finally {
      setIsLoading(false)
    }
  }

  // Feedback visual quando permissão é concedida
  const showPermissionGrantedFeedback = (permissionId: string) => {
    // Feedback visual será mostrado através do ícone no PermissionCard
    console.log(`Permissão ${permissionId} concedida!`)
  }

  // Feedback quando permissão é negada
  const showPermissionDeniedFeedback = (permissionId: string) => {
    const permissionName =
      permissionId === 'location'
        ? t('onboarding:permissions_title_1')
        : t('onboarding:permissions_title_2')

    Alert.alert(
      t('onboarding:permission_denied_title'),
      t('onboarding:permission_denied_message', { permission: permissionName }),
      [
        {
          text: t('common:buttons.settings'),
          onPress: () => {
            // Abrir configurações do app
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:')
            } else {
              Linking.openSettings()
            }
          }
        },
        {
          text: t('common:buttons.continue'),
          style: 'cancel'
        }
      ]
    )
  }

  // Ir para próxima tela
  const goToNextStep = () => {
    try {
      // Marcar que o usuário já viu as permissões
      setPermissionsSeen(true)

      // Navegar para próxima tela
      navigation.replace(ROUTES.AuthStack.WELCOME)
    } catch (error) {
      console.error('Erro ao salvar estado das permissões:', error)
      navigation.replace(ROUTES.AuthStack.WELCOME)
    }
  }

  // Verificar se pode continuar (todas as permissões foram tratadas)
  const canContinue = permissions.every(
    permission =>
      permission.status !== 'pending' &&
      permission.status !== 'denied' &&
      permission.status !== 'blocked'
  )

  // Obter ícone baseado no status
  const getStatusIcon = (status: PermissionStatus) => {
    switch (status) {
      case 'granted':
        return <Check size={20} color="#10B981" />
      case 'denied':
      case 'blocked':
        return <X size={20} color="#EF4444" />
      default:
        return undefined
    }
  }

  // Obter cor do status
  const getStatusColor = (status: PermissionStatus) => {
    switch (status) {
      case 'granted':
        return '#10B981'
      case 'denied':
      case 'blocked':
        return '#EF4444'
      default:
        return '#6B7280'
    }
  }

  // Inicializar estados das permissões
  useEffect(() => {
    checkAllPermissions()
  }, [])

  return (
    <View className="flex-1 bg-white p-container">
      <View className="flex items-center my-6">
        <Image
          source={require('@/assets/images/illustration/location-permission.png')}
          style={{ width: 235, height: 280, resizeMode: 'contain' }}
        />

        <Text className="text-2xl font-extrabold mt-4">
          {t('onboarding:permissions_title')}
        </Text>
        <Text className="text-gray-500 mt-1 text-center">
          {t('onboarding:permissions_description')}
        </Text>
      </View>

      <ScrollView className="flex-1">
        {permissions.map(permission => (
          <PermissionCard
            key={permission.id}
            icon={permission.icon}
            label={permission.title}
            description={permission.description}
            // Permission
            statusIcon={getStatusIcon(permission.status)}
            statusColor={getStatusColor(permission.status)}
            onPress={() => requestPermission(permission.id)}
            disabled={isLoading || permission.status === 'granted'}
            showButton={permission.status !== 'granted'}
            buttonLabel={
              permission.status === 'denied' || permission.status === 'blocked'
                ? t('common:buttons.try_again')
                : t('common:buttons.allow')
            }
          />
        ))}
      </ScrollView>

      <PrimaryButton
        className="mb-8"
        label={t('common:buttons.continue')}
        onPress={goToNextStep}
        disabled={!canContinue || isLoading}
        loading={isLoading}
      />

      {/* line linear gradient */}
      <LineGradient />
    </View>
  )
}

export default Permissions
