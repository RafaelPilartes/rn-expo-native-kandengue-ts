// core/interfaces/IPromotionUsageRepository.ts
import type { PromotionUsageInterface } from '@/interfaces/IPromotion';

/**
 * Repository de leitura sobre `promotion_usages` (Firestore).
 * O passageiro só lê — escritas são feitas pelo backend e triggers.
 */
export interface IPromotionUsageRepository {
  getActiveReservation(
    userId: string,
  ): Promise<PromotionUsageInterface | null>;

  getByRideId(rideId: string): Promise<PromotionUsageInterface | null>;

  listenActiveReservation(
    userId: string,
    onUpdate: (usage: PromotionUsageInterface | null) => void,
    onError?: (err: Error) => void,
  ): () => void;
}
