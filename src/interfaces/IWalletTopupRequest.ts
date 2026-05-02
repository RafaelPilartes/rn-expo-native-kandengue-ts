import type {
  WalletTopupStatus,
  WalletTopupMethodType,
  currencyEnumType
} from '@/types/enum'

export interface WalletTopupRequestInterface {
  id: string
  wallet_id: string
  user_id: string

  amount: number
  currency: currencyEnumType

  method: WalletTopupMethodType
  status: WalletTopupStatus

  // Idempotência
  idempotency_key: string

  // Unitel Money
  phone_number?: string
  originator_conversation_id?: string
  conversation_id?: string
  provider_transaction_id?: string

  // Controlo
  provider_status?: string
  failure_code?: string
  failure_message?: string

  // Manual (transferência bancária / cash)
  proof_url?: string
  reviewed_by?: string | null
  rejected_reason?: string

  // Timestamps
  created_at?: Date
  processed_at?: Date
  confirmed_at?: Date
  updated_at?: Date
}

