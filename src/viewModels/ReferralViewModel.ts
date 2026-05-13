import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppConfigUseCase } from '@/domain/usecases/appConfigUseCase'
import { PromotionUseCase } from '@/domain/usecases/promotionUseCase'
import type {
  ListMyEarningsResponse,
  ReferralSettingsInterface,
  RequestWithdrawalRequest,
} from '@/interfaces/IPromotion'

const promotionUseCase = new PromotionUseCase()
const appConfigUseCase = new AppConfigUseCase()

const EARNINGS_KEY = ['referral', 'earnings', 'me']
const SETTINGS_KEY = ['referral', 'settings']

export function useReferralEarningsViewModel() {
  const queryClient = useQueryClient()

  const earningsQuery = useQuery<ListMyEarningsResponse>({
    queryKey: EARNINGS_KEY,
    queryFn: () => promotionUseCase.listMyEarnings(),
    staleTime: 30 * 1000,
  })

  const settingsQuery = useQuery<ReferralSettingsInterface | null>({
    queryKey: SETTINGS_KEY,
    queryFn: () => appConfigUseCase.getReferralSettings(),
    staleTime: 60 * 1000,
  })

  const withdrawalMutation = useMutation({
    mutationFn: (input: RequestWithdrawalRequest) =>
      promotionUseCase.requestWithdrawal(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EARNINGS_KEY })
    },
  })

  const minimum = settingsQuery.data?.minimum_withdrawal_amount ?? 0
  const pending = earningsQuery.data?.totals.pending ?? 0
  const canWithdraw = pending >= minimum && pending > 0

  return {
    earnings: earningsQuery.data?.earnings ?? [],
    totals: earningsQuery.data?.totals ?? {
      paid: 0,
      pending: 0,
      requested: 0,
    },
    minimum,
    canWithdraw,
    isLoading: earningsQuery.isLoading || settingsQuery.isLoading,
    error: earningsQuery.error || settingsQuery.error,
    refetch: earningsQuery.refetch,
    requestWithdrawal: withdrawalMutation.mutateAsync,
    isSubmittingWithdrawal: withdrawalMutation.isPending,
  }
}
