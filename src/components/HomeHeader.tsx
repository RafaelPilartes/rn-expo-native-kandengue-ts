import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Bell } from 'lucide-react-native'
import { UserInterface } from '@/interfaces/IUser'

interface HeaderProps {
  user: UserInterface | null
  onNotifications: () => void
}

const getGreetingMessage = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

const HomeHeader: React.FC<HeaderProps> = ({ user, onNotifications }) => {
  const firstName = user?.name.split(' ')[0] || ''
  const lastName = user?.name.split(' ')[1] || ''

  return (
    <View
      style={styles.container}
      className="px-5 py-3 flex-row items-center justify-between bg-white"
    >
      {/* User Info */}
      <View className="flex-row items-center flex-1">
        <View className="relative">
          <Image
            source={{
              uri:
                user?.photo ??
                'https://cdn-icons-png.flaticon.com/512/3541/3541871.png'
            }}
            className="w-12 h-12 rounded-full"
          />
          {/* Online indicator */}
          <View
            className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"
            style={{ position: 'absolute', bottom: 2, right: 0 }}
          />
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-sm text-slate-500">
            {getGreetingMessage()} 👋
          </Text>
          <Text
            className="text-lg font-bold text-slate-900 tracking-tight"
            numberOfLines={1}
          >
            {firstName} {lastName}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={onNotifications}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
        >
          <Bell size={20} color="#475569" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9' // slate-100 subtle separator
  }
})

export default HomeHeader
