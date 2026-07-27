// core/interfaces/IPromotionUsageRepository.ts
import type { PromotionUsage } from '@rafaelpilartes/kandengue-shared/usage';

/**
 * Repository de leitura sobre `promotion_usages` (Firestore).
 * O passageiro só lê — escritas são feitas pelo backend e triggers.
 */
export interface IPromotionUsageRepository {
  getActiveReservation(
    userId: string,
  ): Promise<PromotionUsage | null>;

  getByRideId(rideId: string): Promise<PromotionUsage | null>;

  listenActiveReservation(
    userId: string,
    onUpdate: (usage: PromotionUsage | null) => void,
    onError?: (err: Error) => void,
  ): () => void;
}
