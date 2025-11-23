import { StatusBar } from 'expo-status-bar'
import { Text, View } from 'react-native'
import '@/styles/global.css'
import 'react-native-gesture-handler'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <Text className="text-3xl text-primary-200 font-semibold">
        Hello world
      </Text>
      <StatusBar style="auto" />
    </View>
  )
}
