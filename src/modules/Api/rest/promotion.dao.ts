import { getAuth, getIdToken } from '@react-native-firebase/auth'
import type { IPromotionRepository } from '@/core/interfaces/IPromotionRepository'
import type {
  ApplyPromotionRequest,
  ApplyPromotionResponse,
  ListMyEarningsResponse,
  RequestWithdrawalRequest,
  RequestWithdrawalResponse,
  ValidatePromotionRequest,
  ValidatePromotionResponse,
} from '@/interfaces/IPromotion'
import ApiDAO from './Api.dao'

async function authHeaders(): Promise<Record<string, string>> {
  const currentUser = getAuth().currentUser
  if (!currentUser) {
    throw new Error('User not authenticated')
  }
  const idToken = await getIdToken(currentUser)
  return { Authorization: `Bearer ${idToken}` }
}

export class RestPromotionDAO implements IPromotionRepository {
  async validate(
    body: ValidatePromotionRequest,
  ): Promise<ValidatePromotionResponse> {
    return ApiDAO.post<ValidatePromotionResponse>(
      '/api/v1/promotions/validate',
      body,
      await authHeaders(),
    )
  }

  async apply(body: ApplyPromotionRequest): Promise<ApplyPromotionResponse> {
    return ApiDAO.post<ApplyPromotionResponse>(
      '/api/v1/promotions/apply',
      body,
      await authHeaders(),
    )
  }

  async listMyEarnings(): Promise<ListMyEarningsResponse> {
    return ApiDAO.get<ListMyEarningsResponse>(
      '/api/v1/referral/earnings/me',
      await authHeaders(),
    )
  }

  async requestWithdrawal(
    body: RequestWithdrawalRequest,
  ): Promise<RequestWithdrawalResponse> {
    return ApiDAO.post<RequestWithdrawalResponse>(
      '/api/v1/referral/withdrawal/request',
      body,
      await authHeaders(),
    )
  }
}
