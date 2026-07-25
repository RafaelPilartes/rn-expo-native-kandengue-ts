// src/hooks/ride/useRideFlow.ts
import { RideStatusType, RideType } from '@/types/enum'
import { useRidesViewModel } from '@/viewModels/RideViewModel'
import { useLocation } from '../useLocation'
import { RideFareInterface } from '@/interfaces/IRideFare'
import { RideInterface } from '@/interfaces/IRide'
import { GeoLocationType } from '@/types/geoLocation'
import { RideDetailsType } from '@/types/ride'
import { useAppProvider } from '@/providers/AppProvider'
import { calculateFare } from '@/helpers/rideCalculate'
import { RideRateEntity } from '@/core/entities/RideRate'

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
  cancelledBy?: 'driver' | 'user' | 'system'
}

export type CreateRideParams = {
  pickup: GeoLocationType
  dropoff: GeoLocationType
  type: RideType
  distance: number
  duration: number
  details: RideDetailsType
  fare: RideFareInterface
  promotion_id?: string
  promotion_usage_id?: string
}

export function useRideFlow(
  rideId?: string,
  rideFare?: RideFareInterface | null,
  rideRates?: RideRateEntity | null
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
    fare,
    cancelledBy
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
          fare: fare ?? undefined,
          cancelled_by: cancelledBy ?? undefined
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
    fare,
    promotion_id,
    promotion_usage_id
  }: CreateRideParams): Promise<RideInterface | undefined> => {
    if (!currentUserData) return

    const newRide: Omit<RideInterface, 'id'> = {
      user: currentUserData,
      pickup,
      dropoff,
      status: 'idle',
      fare,
      distance,
      duration,
      type,
      details,
      ...(rideRates ? {
        rate: {
          insurance_percent: rideRates.insurance_percent,
          payouts: {
            driver_percent: rideRates.payouts.driver_percent,
            company_percent: rideRates.payouts.company_percent,
            pension_fund_percent: rideRates.payouts.pension_fund_percent,
          }
        }
      } : {}),
      ...(promotion_id ? { promotion_id } : {}),
      ...(promotion_usage_id ? { promotion_usage_id } : {})
    }

    try {
      return await createRide.mutateAsync(newRide)
    } catch (error: any) {
      console.error('❌ Erro ao criar corrida:', error)
      throw new Error(error.message || 'Erro ao criar corrida')
    }
  }

  const confirm = async () => {
    try {
      await syncStatusToServer({ status: 'driver_on_the_way' })
      startTracking('RIDE')
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
    } catch (error: any) {
      console.error('❌ Erro ao confirmar recolha do pacote:', error)
      throw error
    }
  }

  const arrivedDropoff = async () => {
    try {
      await syncStatusToServer({ status: 'arrived_dropoff' })
    } catch (error: any) {
      console.error('❌ Erro ao confirmar chegada na entrega:', error)
      throw error
    }
  }

  /**
   * Complete the ride with fare recalculation.
   * Final fare = max(original_fare, fare_based_on_actual_distance)
   * This ensures the driver is compensated for longer routes.
   */
  const completed = async (
    photoUri?: string,
    actualDistanceKm?: number,
    waitMinutes?: number
  ) => {
    if (!rideFare) {
      throw new Error('Dados de fare não encontrados para completar a corrida')
    }

    let finalFare = rideFare

    // Recalculate fare if actual distance is greater and we have rates
    if (actualDistanceKm && rideRates && actualDistanceKm > 0) {
      const recalculatedFare = calculateFare(
        actualDistanceKm,
        waitMinutes ?? 0,
        rideRates
      )

      // calculateFare() é promo-blind — compara sempre valores BRUTOS
      // (antes de desconto). Comparar contra rideFare.total penalizaria
      // uma ride com promoção aplicada (total já líquido de desconto)
      // face a um recálculo sempre bruto.
      const originalGross = rideFare.breakdown.gross_amount ?? rideFare.total
      const recalculatedGross =
        recalculatedFare.breakdown.gross_amount ?? recalculatedFare.total

      // Use o maior fare bruto: max(original, recalculado) — mas preserva
      // o desconto/promoção original em vez de os descartar silenciosamente.
      if (recalculatedGross > originalGross) {
        const discount = rideFare.breakdown.discount ?? 0
        finalFare = {
          ...recalculatedFare,
          total: recalculatedFare.total - discount,
          breakdown: {
            ...recalculatedFare.breakdown,
            discount: rideFare.breakdown.discount,
            promotion_id: rideFare.breakdown.promotion_id,
            promotion_code: rideFare.breakdown.promotion_code
          }
        }
      }
    }

    try {
      await syncStatusToServer({
        status: 'completed',
        completedAt: new Date(),
        proofDropoffPhoto: photoUri,
        fare: finalFare
      })

      await stopTracking()
    } catch (error: any) {
      console.error('❌ Erro ao completar corrida:', error)
      throw error
    }
  }

  const canceled = async (reason: string) => {
    try {
      // cancelled_by: 'user' — sinaliza ao trigger onRideCancelled que aplica
      // a janela de graça (2min) sobre driver_matched_at.
      await syncStatusToServer({
        status: 'canceled',
        reason,
        canceledAt: new Date(),
        cancelledBy: 'user'
      })

      await stopTracking()
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
