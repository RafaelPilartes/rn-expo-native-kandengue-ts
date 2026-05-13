// Replicação manual — fonte de verdade: documento "08 — Firestore Schema".

export type PromotionType = 'percentage' | 'fixed' | 'free_ride'

export type PromotionUsageStatus =
  | 'reserved'
  | 'used'
  | 'cancelled'
  | 'expired'

export type EarningStatus = 'pending' | 'requested' | 'paid' | 'cancelled'

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'paid'

export type RideKind = 'car' | 'motorcycle' | 'bicycle' | 'delivery'

export type RidePaymentMethod = 'cash' | 'card' | 'wallet'

export interface AllowedCities {
  origin: string[]
  destination: string[]
  match: 'both' | 'any'
}

export interface PromotionRules {
  new_users_only?: boolean
  inactive_days?: number
  has_specific_users?: boolean
  allowed_cities?: AllowedCities
  ride_types?: RideKind[]
  payment_methods?: RidePaymentMethod[]
}

export interface ReferralConfig {
  enabled: boolean
  owner_user_id: string
  reward_type: 'fixed' | 'percentage'
  reward_value: number
}

export interface PromotionInterface {
  id: string
  code: string
  type: PromotionType
  value: number
  max_discount?: number
  min_ride_value?: number
  usage_limit_total?: number
  usage_limit_per_user?: number
  used_count_approx: number
  reserved_count_approx: number
  valid_from: Date
  valid_until: Date
  active: boolean
  rules: PromotionRules
  referral?: ReferralConfig
  created_by: string
  created_at: Date
}

export interface PromotionUsageInterface {
  id: string
  promotion_id: string
  user_id: string
  ride_id: string | null
  status: PromotionUsageStatus
  discount_applied: number
  device_id?: string | null
  grace_cancel_count: number
  driver_cancel_count: number
  expires_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface ReferralEarningInterface {
  id: string
  referrer_user_id: string
  referred_user_id: string
  promotion_id: string
  ride_id: string
  reward_type: 'fixed' | 'percentage'
  reward_value: number
  reward_amount: number
  status: EarningStatus
  requested_at?: Date | null
  paid_at?: Date | null
  created_at: Date
}

export interface WithdrawalRequestInterface {
  id: string
  user_id: string
  earning_ids: string[]
  total_amount: number
  status: WithdrawalStatus
  payment_details: {
    bank_name: string
    account_number: string
    account_holder: string
  }
  admin_notes?: string
  created_at: Date
  paid_at?: Date
}

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
    Omit<ReferralEarningInterface, 'created_at' | 'requested_at' | 'paid_at'> & {
      created_at: string
      requested_at?: string | null
      paid_at?: string | null
    }
  >
}
