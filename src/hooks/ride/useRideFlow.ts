// src/screens/hooks/useRideFlow.ts
import { RideStatusType, RideType } from '@/types/enum'
import { useRidesViewModel } from '@/viewModels/RideViewModel'
import { useAuthStore } from '@/storage/store/useAuthStore'
import { useLocation } from '../useLocation'
import { DriverInterface } from '@/interfaces/IDriver'
import { RideFareInterface } from '@/interfaces/IRideFare'
import { useWalletsViewModel } from '@/viewModels/WalletViewModel'
import { useTransactionsViewModel } from '@/viewModels/TransactionViewModel'
import { RideInterface } from '@/interfaces/IRide'
import { GeoLocationType } from '@/types/geoLocation'
import { RideDetailsType } from '@/types/ride'
import { useAppProvider } from '@/providers/AppProvider'

type SyncStatusToServerParams = {
  status: RideStatusType
  reason?: string
  proofPickupPhoto?: string
  proofDropoffPhoto?: string
  waitingStartAt?: Date
  waitingEndAt?: Date
  completedAt?: Date
  canceledAt?: Date
  fare?: RideFareInterface | null
}
type CreateParams = {
  pickup: GeoLocationType
  dropoff: GeoLocationType
  type: RideType
  distance: number
  duration: number
  details: RideDetailsType
  fare: RideFareInterface
}

export function useRideFlow(
  rideId?: string,
  rideFare?: RideFareInterface | null
) {
  const { createRide, updateRide } = useRidesViewModel()
  const { startTracking, stopTracking } = useLocation()
  const { currentUserData } = useAppProvider()

  const syncStatusToServer = async ({
    status,
    reason,
    proofPickupPhoto,
    proofDropoffPhoto,
    waitingStartAt,
    waitingEndAt,
    completedAt,
    canceledAt,
    fare
  }: SyncStatusToServerParams) => {
    if (!rideId) return

    try {
      await updateRide.mutateAsync({
        id: rideId,
        ride: {
          status,
          cancel_reason: reason ?? undefined,
          proof_pickup_photo: proofPickupPhoto ?? undefined,
          proof_dropoff_photo: proofDropoffPhoto ?? undefined,
          waiting_start_at: waitingStartAt ?? undefined,
          waiting_end_at: waitingEndAt ?? undefined,
          completed_at: completedAt ?? undefined,
          canceled_at: canceledAt ?? undefined,
          fare: fare ?? undefined
        }
      })
    } catch (error: any) {
      console.error('❌ Erro ao sincronizar status com servidor:', error)
      throw new Error(error.message || 'Erro ao atualizar status da corrida')
    }
  }

  const create = async ({
    pickup,
    dropoff,
    distance,
    duration,
    type,
    details,
    fare
  }: CreateParams): Promise<RideInterface | undefined> => {
    if (!currentUserData) return

    const newRide: Omit<RideInterface, 'id'> = {
      user: currentUserData,
      pickup: pickup,
      dropoff: dropoff,
      status: 'idle',
      fare: fare,
      distance: distance,
      duration: duration,
      type: type,
      details: details
    }

    console.log('newRide', newRide)

    const ride = await createRide.mutateAsync(newRide)

    try {
      return ride
    } catch (error: any) {
      console.error('❌ Erro ao criar corrida:', error)
      throw new Error(error.message || 'Erro ao criar corrida')
    }
  }

  /** ---- ACTIONS ---- */
  const confirm = async () => {
    try {
      await syncStatusToServer({ status: 'driver_on_the_way' })
      startTracking('RIDE')

      console.log('✅ Corrida confirmada - Motorista a caminho')
    } catch (error: any) {
      console.error('❌ Erro ao confirmar corrida:', error)
      throw error
    }
  }

  const arrivedPickup = async () => {
    try {
      await syncStatusToServer({
        status: 'arrived_pickup',
        waitingStartAt: new Date()
      })

      console.log('✅ Chegou ao local de recolha')
    } catch (error: any) {
      console.error('❌ Erro ao confirmar chegada na recolha:', error)
      throw error
    }
  }

  const pickedUp = async () => {
    try {
      await syncStatusToServer({
        status: 'picked_up',
        waitingEndAt: new Date()
      })

      console.log('✅ Pacote recolhido com sucesso')
    } catch (error: any) {
      console.error('❌ Erro ao confirmar recolha do pacote:', error)
      throw error
    }
  }

  const arrivedDropoff = async () => {
    try {
      await syncStatusToServer({ status: 'arrived_dropoff' })
      console.log('✅ Chegou ao local de entrega')
    } catch (error: any) {
      console.error('❌ Erro ao confirmar chegada na entrega:', error)
      throw error
    }
  }

  const completed = async (photoUri?: string) => {
    if (!rideFare) {
      const errorMsg = 'Dados de fare não encontrados para completar a corrida'
      console.error('❌', errorMsg)
      throw new Error(errorMsg)
    }
  }

  const canceled = async (reason: string) => {
    try {
      await syncStatusToServer({
        status: 'canceled',
        reason,
        canceledAt: new Date()
      })

      await stopTracking()

      console.log('❌ Corrida cancelada:', reason)
    } catch (error: any) {
      console.error('❌ Erro ao cancelar corrida:', error)
      throw error
    }
  }

  return {
    create,
    confirm,
    arrivedPickup,
    pickedUp,
    arrivedDropoff,
    completed,
    canceled
  }
}
