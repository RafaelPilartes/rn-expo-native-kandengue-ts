// src/domain/usecases/promotionUseCase.ts
import { promotionRepository } from '@/modules/Api'
import type {
  ApplyPromotionRequest,
  ApplyPromotionResponse,
  ListMyEarningsResponse,
  RequestWithdrawalRequest,
  RequestWithdrawalResponse,
  ValidatePromotionRequest,
  ValidatePromotionResponse,
} from '@/interfaces/IPromotion'

export class PromotionUseCase {
  private repository = promotionRepository

  async validate(
    body: ValidatePromotionRequest,
  ): Promise<ValidatePromotionResponse> {
    try {
      return await this.repository.validate(body)
    } catch (error: any) {
      console.error('Erro ao validar código promocional:', error)
      throw new Error(error.message || 'Erro ao validar código promocional')
    }
  }

  async apply(body: ApplyPromotionRequest): Promise<ApplyPromotionResponse> {
    try {
      return await this.repository.apply(body)
    } catch (error: any) {
      console.error('Erro ao aplicar código promocional:', error)
      throw new Error(error.message || 'Erro ao aplicar código promocional')
    }
  }

  async listMyEarnings(): Promise<ListMyEarningsResponse> {
    try {
      return await this.repository.listMyEarnings()
    } catch (error: any) {
      console.error('Erro ao listar ganhos de referência:', error)
      throw new Error(error.message || 'Erro ao listar ganhos de referência')
    }
  }

  async requestWithdrawal(
    body: RequestWithdrawalRequest,
  ): Promise<RequestWithdrawalResponse> {
    try {
      return await this.repository.requestWithdrawal(body)
    } catch (error: any) {
      console.error('Erro ao solicitar saque:', error)
      throw new Error(error.message || 'Erro ao solicitar saque')
    }
  }
}
