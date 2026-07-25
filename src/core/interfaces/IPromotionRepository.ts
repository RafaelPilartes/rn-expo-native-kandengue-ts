// core/interfaces/IPromotionRepository.ts
import type {
  ApplyPromotionRequest,
  ApplyPromotionResponse,
  ListMyEarningsResponse,
  RequestWithdrawalRequest,
  RequestWithdrawalResponse,
  ValidatePromotionRequest,
  ValidatePromotionResponse,
} from '@/interfaces/IPromotion';

/**
 * Repository do sistema de promoções (REST).
 * As operações vão à API Fastify autenticadas via Firebase ID token.
 */
export interface IPromotionRepository {
  validate(body: ValidatePromotionRequest): Promise<ValidatePromotionResponse>;
  apply(body: ApplyPromotionRequest): Promise<ApplyPromotionResponse>;
  listMyEarnings(): Promise<ListMyEarningsResponse>;
  requestWithdrawal(
    body: RequestWithdrawalRequest,
  ): Promise<RequestWithdrawalResponse>;
}
