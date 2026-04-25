import { useState, useEffect, useRef, useMemo } from 'react'
import { useDriversViewModel } from '@/viewModels/DriverViewModel'
import { LocationType } from '@/types/geoLocation'
import { DriverEntity } from '@/core/entities/Driver'
import { calculateHeading } from '@/helpers/bearing'

type DriverRealtimeInfo = {
  location: LocationType | null
  heading: number
}

export function useDriverRealtimeLocation(
  driverId?: string | null
): DriverRealtimeInfo {
  const [location, setLocation] = useState<LocationType | null>(null)
  const previousLocationRef = useRef<LocationType | null>(null)
  const [heading, setHeading] = useState(0)
  const { listenDriverRealtime } = useDriversViewModel()

  useEffect(() => {
    if (!driverId) {
      setLocation(null)
      setHeading(0)
      previousLocationRef.current = null
      return
    }

    listenDriverRealtime(driverId, (driver: DriverEntity) => {
      if (!driver.location) return

      const newLoc = driver.location
      const prevLoc = previousLocationRef.current

      // Calculate heading from previous to current position
      if (prevLoc && (prevLoc.latitude !== newLoc.latitude || prevLoc.longitude !== newLoc.longitude)) {
        const newHeading = newLoc.heading ?? calculateHeading(
          prevLoc.latitude,
          prevLoc.longitude,
          newLoc.latitude,
          newLoc.longitude
        )
        setHeading(newHeading)
      }

      previousLocationRef.current = newLoc
      setLocation(newLoc)
    })

    // Cleanup is handled by the DriverViewModel's internal ref management
    // (listenDriverRealtime removes previous listener before adding a new one,
    //  and the ViewModel's useEffect cleanup runs on unmount)
  }, [driverId])

  return useMemo(() => ({ location, heading }), [location, heading])
}
