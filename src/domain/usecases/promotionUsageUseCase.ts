// src/domain/usecases/promotionUsageUseCase.ts
import { promotionUsageRepository } from '@/modules/Api'
import type { PromotionUsage } from '@rafaelpilartes/kandengue-shared/usage'

export class PromotionUsageUseCase {
  private repository = promotionUsageRepository

  async getActiveReservation(
    userId: string,
  ): Promise<PromotionUsage | null> {
    try {
      return await this.repository.getActiveReservation(userId)
    } catch (error: any) {
      console.error('Erro ao buscar reserva ativa:', error)
      throw new Error(error.message || 'Erro ao buscar reserva ativa')
    }
  }

  async getByRideId(
    rideId: string,
  ): Promise<PromotionUsage | null> {
    try {
      return await this.repository.getByRideId(rideId)
    } catch (error: any) {
      console.error('Erro ao buscar uso por ride:', error)
      throw new Error(error.message || 'Erro ao buscar uso por ride')
    }
  }

  listenActiveReservation(
    userId: string,
    onUpdate: (usage: PromotionUsage | null) => void,
    onError?: (err: Error) => void,
  ) {
    try {
      return this.repository.listenActiveReservation(
        userId,
        onUpdate,
        onError,
      )
    } catch (error: any) {
      console.error('Erro ao escutar reserva ativa:', error)
      throw new Error(error.message || 'Erro ao escutar reserva ativa')
    }
  }
}
