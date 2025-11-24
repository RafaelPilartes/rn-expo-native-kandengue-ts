// src/screens/Profile.tsx
import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import {
  User,
  Edit,
  HelpCircle,
  FileText,
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
import PageHeader from '@/components/PageHeader'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Profile() {
  const navigation = useNavigation<any>()

  const { logout } = useAuthViewModel()

  const { user } = useAuthStore()

  const handleLogout = async () => {
    await logout.mutateAsync()
  }

  const MenuItem = ({
    icon: Icon,
    label,
    onPress
  }: {
    icon: any
    label: string
    onPress: () => void
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100"
    >
      <Icon size={20} color="black" />
      <Text className="ml-3 text-base text-gray-800">{label}</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <PageHeader title="Minha Conta" canGoBack={false} />

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
          <MenuItem icon={LogOut} label="Sair" onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
