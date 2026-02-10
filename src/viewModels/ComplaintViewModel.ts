// src/viewModels/ComplaintViewModel.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ComplaintUseCase } from '@/domain/usecases/complaintUseCase'
import { ComplaintEntity } from '@/core/entities/Complaint'
import { ComplaintInterface } from '@/core/interfaces/IComplaintRepository'
import { useAuthStore } from '@/storage/store/useAuthStore'

const complaintUseCase = new ComplaintUseCase()

export function useComplaintsViewModel() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  // Buscar reclamações do usuário/motorista atual
  const {
    data: complaints = [],
    isLoading,
    error,
    refetch
  } = useQuery<ComplaintEntity[]>({
    queryKey: ['complaints', user?.id],
    queryFn: () => {
      if (!user?.id) return Promise.resolve([])
      return complaintUseCase.getByDriverId(user.id)
    },
    enabled: !!user?.id
  })

  // Criar reclamação
  const createComplaint = useMutation({
    mutationFn: (complaint: Omit<ComplaintInterface, 'id'>) =>
      complaintUseCase.create(complaint),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
    }
  })

  // Atualizar reclamação
  const updateComplaint = useMutation({
    mutationFn: ({
      id,
      complaint
    }: {
      id: string
      complaint: Partial<ComplaintInterface>
    }) => complaintUseCase.update(id, complaint),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
    }
  })

  // Deletar reclamação
  const deleteComplaint = useMutation({
    mutationFn: (id: string) => complaintUseCase.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
    }
  })

  // Buscar estatísticas
  const getComplaintStats = async () => {
    try {
      return await complaintUseCase.getStats(user?.id)
    } catch (error) {
      console.error('Erro ao buscar estatísticas de reclamações:', error)
      return null
    }
  }

  // Buscar reclamação por ID
  const fetchComplaintById = async (
    id: string
  ): Promise<ComplaintEntity | null> => {
    try {
      return await complaintUseCase.getById(id)
    } catch (error) {
      console.error('Erro ao buscar reclamação:', error)
      return null
    }
  }

  return {
    // Data
    complaints,
    isLoading,
    error,

    // Mutations
    createComplaint,
    isLoadingCreateComplaint: createComplaint.isPending,
    updateComplaint,
    isLoadingUpdateComplaint: updateComplaint.isPending,
    deleteComplaint,
    isLoadingDeleteComplaint: deleteComplaint.isPending,

    // Actions
    getComplaintStats,
    fetchComplaintById,
    refreshComplaints: refetch
  }
}
