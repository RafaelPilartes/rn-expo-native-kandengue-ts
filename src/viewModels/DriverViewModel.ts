// viewModels/DriverViewModel.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DriverUseCase } from '@/domain/usecases/driverUseCase';
import { DriverEntity } from '@/core/entities/Driver';
import type { ListResponseType } from '@/interfaces/IApiResponse';
import { firebaseCollections } from '@/constants/firebaseCollections';
import { useEffect, useMemo, useRef } from 'react';
import { LocationType } from '@/types/geoLocation';

const driverUseCase = new DriverUseCase();

export function useDriversViewModel(
  limit?: number,
  offset?: number,
  searchTerm?: string,
  filters?: Partial<DriverEntity>,
) {
  const queryClient = useQueryClient();

  const filtersKey = filters ? JSON.stringify(filters) : '';

  /** Buscar lista de motoristas */
  const {
    data: driversResponse,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ListResponseType<DriverEntity[]>>({
    queryKey: [
      firebaseCollections.drivers.root,
      limit,
      offset,
      searchTerm,
      filtersKey,
    ],
    queryFn: () => driverUseCase.getAll(limit, offset, searchTerm, filters),
    staleTime: 1000 * 60, // cache 1min
  });

  /** Buscar lista de motoristas por field */
  const fetchAllDriversByField = async (
    field: string,
    value: any,
    limit?: number,
    offset?: number,
  ) => {
    try {
      return await driverUseCase.getAllByField(field, value, limit, offset);
    } catch (err) {
      console.error('Erro ao buscar motoristas por campo:', err);
      return null;
    }
  };

  /** Criar motorista */
  const createDriver = useMutation({
    mutationFn: (driver: Omit<DriverEntity, 'id'>) =>
      driverUseCase.create(driver),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.drivers.root],
      });
    },
  });

  /** Atualizar motorista */
  const updateDriver = useMutation({
    mutationFn: ({
      id,
      driver,
    }: {
      id: string;
      driver: Partial<DriverEntity>;
    }) => driverUseCase.update(id, driver),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.drivers.root],
      });
    },
  });

  /** Deletar motorista */
  const deleteDriver = useMutation({
    mutationFn: (id: string) => driverUseCase.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.drivers.root],
      });
    },
  });

  /** Buscar motorista único (on-demand) */
  const fetchDriverById = async (id: string) => {
    try {
      return await driverUseCase.getById(id);
    } catch (err) {
      console.error('Erro ao buscar motorista:', err);
      return null;
    }
  };

  /** Buscar driver por field */
  const fetchOneDriverByField = async (
    field: keyof DriverEntity,
    value: string,
  ) => {
    try {
      return await driverUseCase.getOneByField(field, value);
    } catch (err) {
      console.error('Erro ao buscar motorista por campo:', err);
      return null;
    }
  };

  /** Atualizar disponibilidade operacional */
  const updateDriverAvailability = useMutation({
    mutationFn: ({
      id,
      availability,
    }: {
      id: string;
      availability: DriverEntity['availability'];
    }) => driverUseCase.updateAvailability(id, availability),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.drivers.root],
      }),
  });

  /** Atualizar localização em tempo real */
  const updateDriverLocation = useMutation({
    mutationFn: ({ id, location }: { id: string; location: LocationType }) =>
      driverUseCase.updateLocation(id, location),
  });

  /** Escutar motorista específico em tempo real */
  const driverListenerRef = useRef<null | (() => void)>(null);
  const listenDriverRealtime = (
    id: string,
    onUpdate: (d: DriverEntity) => void,
  ) => {
    if (driverListenerRef.current) {
      driverListenerRef.current(); // remove anterior
    }
    const unsubscribe = driverUseCase.listenDriverRealtime(id, onUpdate, err =>
      console.error('Erro listener motorista:', err),
    );
    driverListenerRef.current = unsubscribe;
  };

  useEffect(() => {
    return () => {
      if (driverListenerRef.current) driverListenerRef.current();
    };
  }, []);

  return {
    // LISTA E PAGINAÇÃO
    drivers: driversResponse?.data ?? [],
    pagination: driversResponse?.pagination,
    isLoadingDrivers: loading,
    error,
    refresh: refetch,

    // CRUD
    createDriver,
    updateDriver,
    updateDriverAvailability,
    updateDriverLocation,
    deleteDriver,

    // CONSULTAS DIRETAS
    fetchDriverById,
    fetchAllDriversByField,
    fetchOneDriverByField,

    // REALTIME
    listenDriverRealtime,
  };
}
