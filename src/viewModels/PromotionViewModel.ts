import { useMutation } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { PromotionUseCase } from '@/domain/usecases/promotionUseCase'
import type {
  ApplyPromotionRequest,
  ApplyPromotionResponse,
  ValidatePromotionRequest,
  ValidatePromotionResponse,
} from '@/interfaces/IPromotion'

const promotionUseCase = new PromotionUseCase()

export type PromotionFeedback =
  | { state: 'idle' }
  | { state: 'validating' }
  | { state: 'valid'; result: ValidatePromotionResponse }
  | { state: 'error'; code?: string; message: string }

/**
 * Hook para o fluxo de validação e aplicação de código promocional.
 *
 *  - validate: lê e valida (idempotente, não escreve)
 *  - apply:    cria reserva ativa (TTL 15min) — chamar antes de criar a ride
 *
 * O `promotion_usage_id` retornado pelo apply deve ser anexado ao documento
 * da ride (campo `promotion_usage_id`) para o trigger onRideCreated vincular.
 */
export function usePromotionViewModel() {
  const [feedback, setFeedback] = useState<PromotionFeedback>({
    state: 'idle',
  })

  const validateMutation = useMutation({
    mutationFn: (input: ValidatePromotionRequest) =>
      promotionUseCase.validate(input),
    onMutate: () => setFeedback({ state: 'validating' }),
    onSuccess: result => setFeedback({ state: 'valid', result }),
    onError: (err: Error) =>
      setFeedback({
        state: 'error',
        message: err.message || 'Código inválido',
      }),
  })

  const applyMutation = useMutation({
    mutationFn: (input: ApplyPromotionRequest) =>
      promotionUseCase.apply(input),
  })

  const reset = useCallback(() => setFeedback({ state: 'idle' }), [])

  return {
    feedback,
    isValidating: validateMutation.isPending,
    isApplying: applyMutation.isPending,
    validate: validateMutation.mutateAsync,
    apply: (input: ApplyPromotionRequest): Promise<ApplyPromotionResponse> =>
      applyMutation.mutateAsync(input),
    reset,
  }
}
