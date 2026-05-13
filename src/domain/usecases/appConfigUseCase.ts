// src/domain/usecases/appConfigUseCase.ts
import { appConfigRepository } from '@/modules/Api'
import type { ReferralSettingsInterface } from '@/interfaces/IPromotion'

export class AppConfigUseCase {
  private repository = appConfigRepository

  async getReferralSettings(): Promise<ReferralSettingsInterface | null> {
    try {
      return await this.repository.getReferralSettings()
    } catch (error: any) {
      console.error('Erro ao ler referral_settings:', error)
      throw new Error(error.message || 'Erro ao ler referral_settings')
    }
  }
}
