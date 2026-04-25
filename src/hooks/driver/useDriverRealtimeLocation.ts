import { useState, useEffect } from 'react'
import { useDriversViewModel } from '@/viewModels/DriverViewModel'
import { LocationType } from '@/types/geoLocation'
import { DriverEntity } from '@/core/entities/Driver'

export function useDriverRealtimeLocation(driverId?: string | null) {
  const [location, setLocation] = useState<LocationType | null>(null)
  const { listenDriverRealtime } = useDriversViewModel()

  useEffect(() => {
    if (!driverId) {
      setLocation(null)
      return
    }

    listenDriverRealtime(driverId, (driver: DriverEntity) => {
      if (driver.location) {
        setLocation(driver.location)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverId])

  return location
}
