import { useEffect, useRef, useState } from 'react'
import { RideFareInterface } from '@/interfaces/IRideFare'
import { useRidesViewModel } from '@/viewModels/RideViewModel'

export function useRideFinishedFare(
  rideId: string | undefined,
  initialFare: RideFareInterface,
  hasPromo: boolean,
) {
  const { listenRideRealtime } = useRidesViewModel()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [fare, setFare] = useState<RideFareInterface>(initialFare)
  const [isVerifying, setIsVerifying] = useState(hasPromo && !!rideId)

  useEffect(() => {
    if (!rideId || !hasPromo) return

    timerRef.current = setTimeout(() => setIsVerifying(false), 12000)

    listenRideRealtime(rideId, updatedRide => {
      if (!updatedRide.fare) return
      setFare(updatedRide.fare)
      // Trigger confirms fare once discount field is populated
      if (updatedRide.fare.breakdown?.discount !== undefined) {
        setIsVerifying(false)
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    })

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [rideId, hasPromo]) // eslint-disable-line react-hooks/exhaustive-deps

  return { fare, isVerifying }
}
