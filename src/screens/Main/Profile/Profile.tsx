// src/screens/Profile.tsx
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native'
import {
  Edit,
  HelpCircle,
  Info,
  Shield,
  Book,
  AlertCircle,
  LogOut
} from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import ROUTES from '@/constants/routes'
import { useAuthViewModel } from '@/viewModels/AuthViewModel'
import { useAuthStore } from '@/storage/store/useAuthStore'
import { PageHeader } from '@/components/PageHeader'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Profile() {
  const navigation = useNavigation<any>()

  const { logout } = useAuthViewModel()
  const { user } = useAuthStore()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout.mutateAsync()
    } finally {
      setIsLoggingOut(false)
    }
  }

  const MenuItem = ({
    icon: Icon,
    label,
    onPress,
    isLoading
  }: {
    icon: any
    label: string
    onPress: () => void
    isLoading?: boolean
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100"
    >
      <Icon size={20} color={isLoading ? '#9ca3af' : 'black'} />
      <Text className={`ml-3 text-base flex-1 ${isLoading ? 'text-gray-400' : 'text-gray-800'}`}>
        {isLoading ? 'Saindo...' : label}
      </Text>
      {isLoading && <ActivityIndicator size="small" color="#111827" />}
    </TouchableOpacity>
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* User Info */}
        <View className="items-center py-6 bg-white mb-3 rounded-b-3xl">
          <Image
            source={{
              uri:
                user?.photo ??
                'https://cdn-icons-png.flaticon.com/512/3541/3541871.png'
            }}
            className="w-24 h-24 rounded-full mb-3"
          />
          <Text className="text-2xl font-semibold text-black">
            {user?.name}
          </Text>
          <Text className="text-gray-500 text-sm">{user?.email}</Text>
        </View>

        {/* Menu Options */}
        <View className="bg-white mb-4 px-6 rounded-2xl">
          <MenuItem
            icon={Edit}
            label="Editar Perfil"
            onPress={() => navigation.navigate(ROUTES.ProfileStack.EDIT)}
          />
          <MenuItem
            icon={Info}
            label="Sobre"
            onPress={() => navigation.navigate(ROUTES.ProfileStack.ABOUT)}
          />
          <MenuItem
            icon={HelpCircle}
            label="FAQ"
            onPress={() => navigation.navigate(ROUTES.ProfileStack.FAQ)}
          />
          <MenuItem
            icon={AlertCircle}
            label="Reclamações"
            onPress={() => navigation.navigate(ROUTES.ProfileStack.COMPLAINTS)}
          />
          <MenuItem
            icon={HelpCircle}
            label="Ajuda"
            onPress={() => navigation.navigate(ROUTES.ProfileStack.HELP)}
          />
        </View>

        {/* Legal */}
        <View className="bg-white mb-4 px-6 rounded-2xl">
          <MenuItem
            icon={Shield}
            label="Política de Privacidade"
            onPress={() => navigation.navigate(ROUTES.ProfileStack.PRIVATE)}
          />
          <MenuItem
            icon={Book}
            label="Termos e Condições"
            onPress={() => navigation.navigate(ROUTES.ProfileStack.TERMS)}
          />
        </View>

        {/* Logout */}
        <View className="bg-white mb-4 px-6 rounded-b-3xl">
          <MenuItem 
            icon={LogOut} 
            label="Sair" 
            onPress={handleLogout} 
            isLoading={isLoggingOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
