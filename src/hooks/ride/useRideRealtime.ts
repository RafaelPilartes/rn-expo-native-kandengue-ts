import { useEffect, useState } from 'react'
import { useRidesViewModel } from '@/viewModels/RideViewModel'
import { RideInterface } from '@/interfaces/IRide'
import { useRideTrackingsViewModel } from '@/viewModels/RideTrackingViewModel'
import { RideTrackingsInterface } from '@/interfaces/IRideTracking'

export function useRideRealtime(rideId?: string) {
  const { fetchRideById, listenRideRealtime } = useRidesViewModel()
  const {
    fetchAllRideTrackingsByField,
    listenByField: listenRideTrackingsByField
  } = useRideTrackingsViewModel()

  const [ride, setRide] = useState<RideInterface | null>(null)
  const [isLoadingRide, setIsLoadingRide] = useState(true)

  const [rideTracking, setRideTracking] =
    useState<RideTrackingsInterface | null>(null)
  const [isLoadingTracking, setIsLoadingTracking] = useState(true)

  useEffect(() => {
    if (!rideId) {
      setRide(null)
      setIsLoadingRide(false)
      setRideTracking(null)
      setIsLoadingTracking(false)
      return
    }

    // Fetch initial ride data + setup realtime listener
    const initRide = async () => {
      try {
        setIsLoadingRide(true)
        const initialRide = await fetchRideById(rideId)
        setRide(initialRide)
      } catch (err) {
        console.error('Erro ao buscar corrida:', err)
      } finally {
        setIsLoadingRide(false)
      }
    }

    // Fetch initial tracking data + setup realtime listener
    const initTracking = async () => {
      try {
        setIsLoadingTracking(true)
        const result = await fetchAllRideTrackingsByField('ride_id', rideId)
        setRideTracking(result?.data?.[0] ?? null)
      } catch (err) {
        console.error('Erro ao buscar tracking:', err)
      } finally {
        setIsLoadingTracking(false)
      }
    }

    initRide()
    initTracking()

    // Setup realtime listeners
    // Note: ViewModels manage listener cleanup internally via refs
    listenRideRealtime(rideId, (updatedRide) => {
      setRide(updatedRide as unknown as RideInterface)
    })

    listenRideTrackingsByField('ride_id', rideId, (updatedTracking) => {
      setRideTracking(updatedTracking as unknown as RideTrackingsInterface)
    })

    // Cleanup is handled by the ViewModel's internal ref + useEffect cleanup
  }, [rideId])

  return {
    ride,
    isLoadingRide,
    rideTracking,
    isLoadingTracking
  }
}
