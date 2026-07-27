// Replicação manual — fonte de verdade: documento "08 — Firestore Schema".
// Só ficam aqui os contratos REST (específicos desta app) e o tipo que
// continua fora de escopo do pacote partilhado (ReferralSettingsInterface).
// Promotion, PromotionUsage e ReferralEarning vêm de @rafaelpilartes/kandengue-shared.

import type {
  PromotionType,
  RideKind,
  RidePaymentMethod
} from '@rafaelpilartes/kandengue-shared/promotion'
import type { ReferralEarning } from '@rafaelpilartes/kandengue-shared/referral'

export interface ReferralSettingsInterface {
  minimum_withdrawal_amount: number
  updated_by: string
  updated_at: Date
}

// REST API contracts
export interface ValidatePromotionRequest {
  code: string
  ride_context: {
    city_origin: string
    city_destination: string
    ride_type: RideKind
    estimated_price: number
    payment_method: RidePaymentMethod
  }
}

export interface ValidatePromotionResponse {
  valid: true
  code_applied: string
  discount_amount: number
  discount_type: PromotionType
  final_price: number
}

export interface ApplyPromotionRequest extends ValidatePromotionRequest {
  device_id?: string
}

export interface ApplyPromotionResponse {
  promotion_usage_id: string
  promotion_id: string
  expires_at: string
  discount_amount: number
  discount_type: PromotionType
  final_price: number
}

export interface RequestWithdrawalRequest {
  payment_details: {
    bank_name: string
    account_number: string
    account_holder: string
  }
}

export interface RequestWithdrawalResponse {
  withdrawal_id: string
  total_amount: number
  earning_ids: string[]
}

export interface ListMyEarningsResponse {
  totals: {
    paid: number
    pending: number
    requested: number
  }
  earnings: Array<
    Omit<ReferralEarning, 'created_at' | 'requested_at' | 'paid_at'> & {
      created_at: string
      requested_at?: string | null
      paid_at?: string | null
    }
  >
}
