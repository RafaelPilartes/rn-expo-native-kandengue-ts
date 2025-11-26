// src/screens/hooks/useRideRealtime.ts
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
  const [errorRide, setErrorRide] = useState<string | null>(null)
  const [isLoadingRide, setIsLoadingRide] = useState(true)

  const [rideTracking, setRideTracking] =
    useState<RideTrackingsInterface | null>(null)
  const [isLoadingTracking, setIsLoadingTracking] = useState(true)
  const [errorRideTracking, setErrorRideTracking] = useState<string | null>(
    null
  )

  useEffect(() => {
    if (!rideId) {
      setRide(null)
      setIsLoadingRide(false)
      return
    }

    const setupRealtimeListener = async () => {
      try {
        setIsLoadingRide(true)
        setErrorRide(null)

        // Primeiro busca os dados iniciais
        const initialRide = await fetchRideById(rideId)
        setRide(initialRide)
        setIsLoadingRide(false)
      } catch (err) {
        console.error('Erro ao buscar corrida:', err)
        setErrorRide('Erro ao carregar dados da corrida')
        setIsLoadingRide(false)
      }
    }

    const setupRealtimeTrackingListener = async () => {
      try {
        setIsLoadingTracking(true)
        setErrorRideTracking(null)

        // Primeiro busca os dados iniciais
        const initialRideTracking = await fetchAllRideTrackingsByField(
          'ride_id',
          rideId
        )

        if (!initialRideTracking?.data) {
          setRideTracking(null)
          setIsLoadingTracking(false)
          return
        }

        setRideTracking(initialRideTracking?.data[0])
        setIsLoadingTracking(false)
      } catch (err) {
        console.error('Erro ao buscar corrida:', err)
        setErrorRideTracking('Erro ao carregar dados da corrida')
        setIsLoadingTracking(false)
      }
    }

    setupRealtimeListener()
    setupRealtimeTrackingListener()

    const unsubscribeRides = listenRideRealtime(rideId, setRide)
    const unsubscribeRideTrackings = listenRideTrackingsByField(
      'ride_id',
      rideId,
      setRideTracking
    )
    return () => {
      unsubscribeRides
      unsubscribeRideTrackings
    }
  }, [rideId])

  return {
    ride,
    isLoadingRide,
    errorRide,
    rideTracking,
    isLoadingTracking,
    errorRideTracking
  }
}
