import { StatusBar } from 'expo-status-bar'
import './i18n'
import '@/styles/global.css'
import 'react-native-gesture-handler'

import AppRouter from '@/routers'
import { STORAGE_TYPE } from '@/storage/constants'
import { StorageManager } from '@/storage/storageManager'
import { useTranslation } from './hooks/useTranslation'
import { useAppStore } from './storage/store/useAppStore'
import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LocationProvider } from './context/LocationContext'
import { UserRidesProvider } from './context/UserRidesContext'
import { useEffect } from 'react'
import { ThemeProvider } from './providers/ThemeProvider'
import { NetworkProvider } from './providers/NetworkProvider'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const queryClient = new QueryClient()

export default function App() {
  const { language } = useAppStore()
  const { changeLanguage, ready } = useTranslation()

  async function StoragePrepareApp() {
    await StorageManager.initialize(STORAGE_TYPE.MMKV)
  }

  useEffect(() => {
    console.log('Aguardando tradução...')

    if (ready) {
      changeLanguage(language)
      console.log('Aplicando idioma:', language)
    }
  }, [ready, language])

  useEffect(() => {
    const init = async () => {
      await StoragePrepareApp()
    }
    init()
  }, [])

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <BottomSheetModalProvider>
                <LocationProvider>
                  <UserRidesProvider>
                    <NetworkProvider>
                      <StatusBar style="dark" />
                      <AppRouter />
                    </NetworkProvider>
                  </UserRidesProvider>
                </LocationProvider>
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </NavigationContainer>
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
