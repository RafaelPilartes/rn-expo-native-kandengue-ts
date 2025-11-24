// viewModels/RideRateViewModel.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RideRateUseCase } from '@/domain/usecases/rideRateUseCase';
import { RideRateEntity } from '@/core/entities/RideRate';
import type { ListResponseType } from '@/interfaces/IApiResponse';
import { firebaseCollections } from '@/constants/firebaseCollections';
import { useEffect, useRef } from 'react';

const rideRateUseCase = new RideRateUseCase();

export function useRideRatesViewModel(
  limit?: number,
  offset?: number,
  searchTerm?: string,
  filters?: Partial<RideRateEntity>,
) {
  const queryClient = useQueryClient();

  const filtersKey = filters ? JSON.stringify(filters) : '';

  /** Buscar lista de taxa de viagem */
  const {
    data: rideRatesResponse,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ListResponseType<RideRateEntity[]>>({
    queryKey: [
      firebaseCollections.rideRates.root,
      limit,
      offset,
      searchTerm,
      filtersKey,
    ],
    queryFn: () => rideRateUseCase.getAll(limit, offset, searchTerm, filters),
    staleTime: 1000 * 60, // cache 1min
  });

  /** Buscar lista de taxa de viagem por field */
  const fetchAllRideRatesByField = async (
    field: string,
    value: any,
    limit?: number,
    offset?: number,
  ) => {
    try {
      return await rideRateUseCase.getAllByField(field, value, limit, offset);
    } catch (err) {
      console.error('Erro ao buscar taxa de viagem por campo:', err);
      return null;
    }
  };

  /** Criar ride */
  const createRideRate = useMutation({
    mutationFn: (rideRate: Omit<RideRateEntity, 'id'>) =>
      rideRateUseCase.create(rideRate),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.rideRates.root],
      });
    },
  });

  /** Atualizar ride */
  const updateRideRate = useMutation({
    mutationFn: ({
      id,
      rideRate,
    }: {
      id: string;
      rideRate: Partial<RideRateEntity>;
    }) => rideRateUseCase.update(id, rideRate),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.rideRates.root],
      });
    },
  });

  /** Deletar ride */
  const deleteRideRate = useMutation({
    mutationFn: (id: string) => rideRateUseCase.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.rideRates.root],
      });
    },
  });

  /** Buscar ride único (on-demand) */
  const fetchRideRateById = async (id: string) => {
    try {
      return await rideRateUseCase.getById(id);
    } catch (err) {
      console.error('Erro ao buscar corrida:', err);
      return null;
    }
  };

  /** Buscar rideRate por field */
  const fetchOneRideRateByField = async (
    field: keyof RideRateEntity,
    value: string,
  ) => {
    try {
      return await rideRateUseCase.getOneByField(field, value);
    } catch (err) {
      console.error('Erro ao buscar corrida por campo:', err);
      return null;
    }
  };

  // Escutar corridas em tempo real
  const allListenerRef = useRef<null | (() => void)>(null);

  const listenAll = (
    onUpdate: (rides: RideRateEntity[]) => void,
    options?: {
      filters?: Partial<RideRateEntity>;
      limit?: number;
      orderBy?: keyof RideRateEntity;
      orderDirection?: 'asc' | 'desc';
    },
  ) => {
    if (allListenerRef.current) {
      allListenerRef.current(); // remove anterior
    }
    const unsubscribe = rideRateUseCase.listenAll(
      onUpdate,
      err => console.error('Erro listener motorista:', err),
      options,
    );
    allListenerRef.current = unsubscribe;
  };

  useEffect(() => {
    return () => {
      if (allListenerRef.current) allListenerRef.current();
    };
  }, []);

  return {
    rideRates: rideRatesResponse?.data ?? [],
    pagination: rideRatesResponse?.pagination,
    isLoadingRideRates: loading,
    error,
    refresh: refetch,

    fetchAllRideRatesByField,
    fetchOneRideRateByField,

    createRideRate,
    updateRideRate,
    deleteRideRate,
    fetchRideRateById,

    // REALTIME
    listenAll,
  };
}
