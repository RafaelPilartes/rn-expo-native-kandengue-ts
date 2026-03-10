import React, { JSX, useEffect, useState } from 'react'
import { View, Text, ScrollView, Alert, Platform, Linking } from 'react-native'
import * as Location from 'expo-location'
import PermissionCard from '@/components/ui/card/PermissionCard'
import PrimaryButton from '@/components/ui/button/PrimaryButton'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '@/types/navigation'
import ROUTES from '@/constants/routes'
import LineGradient from '@/components/LineGradient'
import { useTranslation } from 'react-i18next'
import { Check, Mic, Navigation, X } from 'lucide-react-native'
import { LocationPermission } from '@/constants/images'
import { usePermissionsStore } from '@/storage/store/usePermissionsStore'
import LocationDisclosureModal from '@/components/modals/LocationDisclosureModal'
import {
  checkNotificationPermission,
  requestNotificationPermission,
  NotificationPermissionResponse
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

  const [showLocationDisclosure, setShowLocationDisclosure] = useState(false)

  // 🔹 Verificar status atual das permissões (usando expo-location)
  const checkAllPermissions = async () => {
    try {
      const { status: locStatus, canAskAgain } =
        await Location.getForegroundPermissionsAsync()
      const notificationStatus = await checkNotificationPermission()

      const locationPermStatus: PermissionStatus =
        locStatus === 'granted'
          ? 'granted'
          : !canAskAgain
            ? 'blocked'
            : locStatus === 'denied'
              ? 'denied'
              : 'pending'

      setPermissions([
        {
          id: 'location',
          icon: <Navigation size={24} color="#3B82F6" />,
          title: t('onboarding:permissions_title_1'),
          description: t('onboarding:permissions_description_1'),
          status: locationPermStatus
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

  // 🔹 Mapear status das notificações
  const mapNotificationStatus = (
    status: NotificationPermissionResponse
  ): PermissionStatus => {
    if (status.granted) return 'granted'
    if (status.denied) return 'denied'
    if (status.blocked) return 'blocked'
    return 'pending'
  }

  // 🔹 Solicitar permissão individual
  const requestPermission = async (
    permissionId: 'location' | 'notifications'
  ) => {
    if (permissionId === 'location') {
      setShowLocationDisclosure(true)
      return
    }

    await processPermissionRequest(permissionId)
  }

  const processPermissionRequest = async (
    permissionId: 'location' | 'notifications'
  ) => {
    try {
      setIsLoading(true)

      let granted = false
      let denied = false

      if (permissionId === 'location') {
        // Usar expo-location para evitar conflito com react-native-permissions no iOS
        const { status, canAskAgain } =
          await Location.requestForegroundPermissionsAsync()

        granted = status === 'granted'
        denied = status !== 'granted'

        // Se foreground foi concedido, tentar background também
        if (granted) {
          const { status: bgStatus } =
            await Location.requestBackgroundPermissionsAsync()
          console.log(`Background location permission: ${bgStatus}`)
        }

        // Se negou e não pode pedir de novo, está bloqueado
        if (denied && !canAskAgain) {
          denied = false // blocked, not just denied
        }
      } else {
        const result = await requestNotificationPermission()
        granted = result.granted
        denied = result.denied || result.blocked
      }

      // Atualizar status da permissão
      await checkAllPermissions()

      // Mostrar feedback baseado no resultado
      if (granted) {
        showPermissionGrantedFeedback(permissionId)
      } else if (denied) {
        showPermissionDeniedFeedback(permissionId)
      }
    } catch (error) {
      console.error(`Erro ao solicitar permissão ${permissionId}:`, error)
      Alert.alert('Erro', 'Erro na solicitação da permissão')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptLocationDisclosure = async () => {
    setShowLocationDisclosure(false)
    // Wait for modal to close (iOS fix)
    setTimeout(async () => {
      await processPermissionRequest('location')
    }, 500)
  }

  // 🔹 Feedback visual quando permissão é concedida
  const showPermissionGrantedFeedback = (permissionId: string) => {
    // Feedback visual será mostrado através do ícone no PermissionCard
    console.log(`Permissão ${permissionId} concedida!`)
  }

  // 🔹 Feedback quando permissão é negada
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

  // 🔹 Ir para próxima tela
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

  // 🔹 Verificar se pode continuar (todas as permissões foram tratadas)
  // [MODIFIED] Permissões agora são opcionais
  const canContinue = true

  // 🔹 Obter ícone baseado no status
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

  // 🔹 Obter cor do status
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

  // 🔹 Inicializar estados das permissões
  useEffect(() => {
    checkAllPermissions()
  }, [])

  return (
    <View className="flex-1 bg-white p-container m-safe">
      <View className="flex items-center my-6">
        <LocationPermission width={235} height={280} />

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
                : t('common:buttons.continue')
            }
          />
        ))}
      </ScrollView>

      <PrimaryButton
        className="mb-8"
        label={t('common:buttons.continue')}
        onPress={goToNextStep}
        disabled={isLoading}
        loading={isLoading}
      />

      {/* line linear gradient */}
      <LineGradient />

      <LocationDisclosureModal
        visible={showLocationDisclosure}
        onAccept={handleAcceptLocationDisclosure}
      />
    </View>
  )
}

export default Permissions
