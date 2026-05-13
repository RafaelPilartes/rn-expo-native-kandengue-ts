// core/interfaces/IAppConfigRepository.ts
import type { ReferralSettingsInterface } from '@/interfaces/IPromotion';

/**
 * Repository de leitura sobre `app_config/*` (Firestore).
 * Atualmente só lê `referral_settings`.
 */
export interface IAppConfigRepository {
  getReferralSettings(): Promise<ReferralSettingsInterface | null>;
}
