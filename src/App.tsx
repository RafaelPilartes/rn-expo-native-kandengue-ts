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
import { UserRidesProvider } from './context/UserRidesContext'
import { AppProvider } from './providers/AppProvider'
import { AlertProvider } from './context/AlertContext'
import { CustomAlert } from './components/ui/CustomAlert'
// import { LocationProvider } from './context/LocationContext'
import React, { useEffect } from 'react'
import { ThemeProvider } from './providers/ThemeProvider'
import { NetworkProvider } from './providers/NetworkProvider'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { LocationProvider } from './context/LocationContext'

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
                <AppProvider>
                  <AlertProvider>
                    <UserRidesProvider>
                      <LocationProvider>
                        <NetworkProvider>
                          <StatusBar style="dark" />
                          <AppRouter />
                          <CustomAlert />
                        </NetworkProvider>
                      </LocationProvider>
                    </UserRidesProvider>
                  </AlertProvider>
                </AppProvider>
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </NavigationContainer>
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
