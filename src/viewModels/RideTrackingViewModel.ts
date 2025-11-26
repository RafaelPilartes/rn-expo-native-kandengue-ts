// viewModels/RideTrackingViewModel.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { RideTrackingUseCase } from '@/domain/usecases/rideTrackingUseCase'
import { RideTrackingEntity } from '@/core/entities/RideTracking'
import type { ListResponseType } from '@/interfaces/IApiResponse'
import { firebaseCollections } from '@/constants/firebaseCollections'
import { useEffect, useRef } from 'react'

const rideTrackingUseCase = new RideTrackingUseCase()

export function useRideTrackingsViewModel(
  limit?: number,
  offset?: number,
  searchTerm?: string,
  filters?: Partial<RideTrackingEntity>
) {
  const queryClient = useQueryClient()

  const filtersKey = filters ? JSON.stringify(filters) : ''

  /** Buscar lista de trajetorias de viagens */
  const {
    data: rideTrackingsResponse,
    isLoading: loading,
    error,
    refetch
  } = useQuery<ListResponseType<RideTrackingEntity[]>>({
    queryKey: [
      firebaseCollections.rideTrackings.root,
      limit,
      offset,
      searchTerm,
      filtersKey
    ],
    queryFn: () =>
      rideTrackingUseCase.getAll(limit, offset, searchTerm, filters),
    staleTime: 1000 * 60 // cache 1min
  })

  /** Buscar lista de trajetorias de viagens por field */
  const fetchAllRideTrackingsByField = async (
    field: keyof RideTrackingEntity,
    value: any,
    limit?: number,
    offset?: number
  ) => {
    try {
      return await rideTrackingUseCase.getAllByField(
        field,
        value,
        limit,
        offset
      )
    } catch (err) {
      console.error('Erro ao buscar trajetorias de viagens por campo:', err)
      return null
    }
  }

  /** Criar trajetoria de viagem */
  const createRideTracking = useMutation({
    mutationFn: (rideTracking: Omit<RideTrackingEntity, 'id'>) =>
      rideTrackingUseCase.create(rideTracking),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.rideTrackings.root]
      })
    }
  })

  /** Atualizar trajetoria de viagem */
  const updateRideTracking = useMutation({
    mutationFn: ({
      id,
      rideTracking
    }: {
      id: string
      rideTracking: Partial<RideTrackingEntity>
    }) => rideTrackingUseCase.update(id, rideTracking),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.rideTrackings.root]
      })
    }
  })

  /** Deletar trajetoria de viagem */
  const deleteRideTracking = useMutation({
    mutationFn: (id: string) => rideTrackingUseCase.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.rideTrackings.root]
      })
    }
  })

  /** Buscar trajetoria de viagem único (on-demand) */
  const fetchRideTrackingById = async (id: string) => {
    try {
      return await rideTrackingUseCase.getById(id)
    } catch (err) {
      console.error('Erro ao buscar trajetoria de viagem:', err)
      return null
    }
  }

  /** Buscar rideTracking por field */
  const fetchOneRideTrackingByField = async (
    field: keyof RideTrackingEntity,
    value: string
  ) => {
    try {
      return await rideTrackingUseCase.getOneByField(field, value)
    } catch (err) {
      console.error('Erro ao buscar trajetoria de viagem por campo:', err)
      return null
    }
  }

  /** Escutar corrida específico em tempo real */
  const rideTrackingListenerRef = useRef<null | (() => void)>(null)
  const listenRideRealtime = (
    id: string,
    onUpdate: (d: RideTrackingEntity) => void
  ) => {
    if (rideTrackingListenerRef.current) {
      rideTrackingListenerRef.current() // remove anterior
    }
    const unsubscribe = rideTrackingUseCase.listenRideRealtime(
      id,
      onUpdate,
      err => console.error('Erro listener corrida:', err)
    )
    rideTrackingListenerRef.current = unsubscribe
  }

  /** Escutar corrida pelo campo em tempo real */
  const fieldListenerRef = useRef<null | (() => void)>(null)
  const listenByField = (
    field: keyof RideTrackingEntity,
    value: string,
    onUpdate: (d: RideTrackingEntity) => void
  ) => {
    if (fieldListenerRef.current) {
      fieldListenerRef.current() // remove anterior
    }
    const unsubscribe = rideTrackingUseCase.listenByField(
      field,
      value,
      onUpdate,
      err => console.error('Erro listener corrida:', err)
    )
    fieldListenerRef.current = unsubscribe
  }

  // Escutar corridas em tempo real
  const allListenerRef = useRef<null | (() => void)>(null)
  const listenAllByField = (
    field: keyof RideTrackingEntity,
    value: any,
    onUpdate: (rideTrackings: RideTrackingEntity[]) => void,
    options?: {
      limit?: number
      orderBy?: keyof RideTrackingEntity
      orderDirection?: 'asc' | 'desc'
    }
  ) => {
    if (allListenerRef.current) {
      allListenerRef.current() // remove anterior
    }
    const unsubscribe = rideTrackingUseCase.listenAllByField(
      field,
      value,
      onUpdate,
      err => console.error('Erro listener motorista:', err),
      options
    )
    allListenerRef.current = unsubscribe
  }

  // Escutar corridas em tempo real
  const listenAll = (
    onUpdate: (rideTrackings: RideTrackingEntity[]) => void,
    options?: {
      filters?: Partial<RideTrackingEntity>
      limit?: number
      orderBy?: keyof RideTrackingEntity
      orderDirection?: 'asc' | 'desc'
    }
  ) => {
    if (allListenerRef.current) {
      allListenerRef.current() // remove anterior
    }
    const unsubscribe = rideTrackingUseCase.listenAll(
      onUpdate,
      err => console.error('Erro listener motorista:', err),
      options
    )
    allListenerRef.current = unsubscribe
  }

  useEffect(() => {
    return () => {
      if (rideTrackingListenerRef.current) rideTrackingListenerRef.current()
      if (fieldListenerRef.current) fieldListenerRef.current()
      if (allListenerRef.current) allListenerRef.current()
    }
  }, [])

  return {
    rideTrackings: rideTrackingsResponse?.data ?? [],
    pagination: rideTrackingsResponse?.pagination,
    isLoadingRidesTracking: loading,
    error,
    refresh: refetch,

    fetchAllRideTrackingsByField,
    fetchOneRideTrackingByField,

    createRideTracking,
    updateRideTracking,
    deleteRideTracking,
    fetchRideTrackingById,

    // REALTIME
    listenRideRealtime,
    listenByField,
    listenAllByField,
    listenAll
  }
}
