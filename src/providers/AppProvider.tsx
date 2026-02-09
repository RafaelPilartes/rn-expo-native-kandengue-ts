import React, { ReactNode } from 'react'
import { LocationProvider } from '../context/LocationContext'
import { AlertProvider } from '../context/AlertContext'
import { MapProvider } from './MapProvider'
import { CustomAlert } from '../components/ui/CustomAlert'
import { NetworkStatusBanner } from '../components/NetworkStatusBanner'

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  return (
    <LocationProvider>
      <AlertProvider>
        <MapProvider>
          <NetworkStatusBanner />
          {children}
          <CustomAlert />
        </MapProvider>
      </AlertProvider>
    </LocationProvider>
  )
}
