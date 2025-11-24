// src/providers/AppContext.tsx
import { UserInterface } from '@/interfaces/IUser'
import { WalletInterface } from '@/interfaces/IWallet'
import { useAppProvider } from '@/providers/AppProvider'

import React, { createContext, useContext, ReactNode } from 'react'

interface AppContextType {
  currentUserData: UserInterface | null
  handleDetailsRide: (ride: any) => void
  handleNotifications: () => void
  handleGoBack: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface HomeProviderProps {
  children: ReactNode
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const appData = useAppProvider()

  return <AppContext.Provider value={appData}>{children}</AppContext.Provider>
}

export const useHome = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useHome must be used within a HomeProvider')
  }
  return context
}
