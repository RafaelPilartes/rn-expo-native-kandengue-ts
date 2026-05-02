import type { TransactionType, TransactionCategoryType } from '@/types/enum'

export interface TransactionInterface {
  id: string
  wallet_id: string
  user_id?: string
  type: TransactionType
  category: TransactionCategoryType
  reference_id?: string // id de corrida, topup
  amount: number
  status?: string
  description?: string
  provider?: 'UNITEL_MONEY'
  provider_transaction_id?: string
  originator_conversation_id?: string
  conversation_id?: string
  created_at?: Date
  updated_at?: Date
}

