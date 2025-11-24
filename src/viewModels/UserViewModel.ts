// viewModels/UserViewModel.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserUseCase } from '@/domain/usecases/userUseCase';
import { UserEntity } from '@/core/entities/User';
import type { ListResponseType } from '@/interfaces/IApiResponse';
import { firebaseCollections } from '@/constants/firebaseCollections';
import { useEffect, useMemo, useRef } from 'react';
import { LocationType } from '@/types/geoLocation';

const userUseCase = new UserUseCase();

export function useUsersViewModel(
  limit?: number,
  offset?: number,
  searchTerm?: string,
  filters?: Partial<UserEntity>,
) {
  const queryClient = useQueryClient();

  const filtersKey = filters ? JSON.stringify(filters) : '';

  /** Buscar lista de motoristas */
  const {
    data: usersResponse,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ListResponseType<UserEntity[]>>({
    queryKey: [
      firebaseCollections.users.root,
      limit,
      offset,
      searchTerm,
      filtersKey,
    ],
    queryFn: () => userUseCase.getAll(limit, offset, searchTerm, filters),
    staleTime: 1000 * 60, // cache 1min
  });

  /** Buscar lista de motoristas por field */
  const fetchAllUsersByField = async (
    field: string,
    value: any,
    limit?: number,
    offset?: number,
  ) => {
    try {
      return await userUseCase.getAllByField(field, value, limit, offset);
    } catch (err) {
      console.error('Erro ao buscar motoristas por campo:', err);
      return null;
    }
  };

  /** Criar motorista */
  const createUser = useMutation({
    mutationFn: (user: Omit<UserEntity, 'id'>) => userUseCase.create(user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.users.root],
      });
    },
  });

  /** Atualizar motorista */
  const updateUser = useMutation({
    mutationFn: ({ id, user }: { id: string; user: Partial<UserEntity> }) =>
      userUseCase.update(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.users.root],
      });
    },
  });

  /** Deletar motorista */
  const deleteUser = useMutation({
    mutationFn: (id: string) => userUseCase.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.users.root],
      });
    },
  });

  /** Buscar motorista único (on-demand) */
  const fetchUserById = async (id: string) => {
    try {
      return await userUseCase.getById(id);
    } catch (err) {
      console.error('Erro ao buscar motorista:', err);
      return null;
    }
  };

  /** Buscar user por field */
  const fetchOneUserByField = async (
    field: keyof UserEntity,
    value: string,
  ) => {
    try {
      return await userUseCase.getOneByField(field, value);
    } catch (err) {
      console.error('Erro ao buscar motorista por campo:', err);
      return null;
    }
  };

  /** Atualizar disponibilidade operacional */
  const updateUserAvailability = useMutation({
    mutationFn: ({
      id,
      availability,
    }: {
      id: string;
      availability: UserEntity['availability'];
    }) => userUseCase.updateAvailability(id, availability),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.users.root],
      }),
  });

  /** Atualizar localização em tempo real */
  const updateUserLocation = useMutation({
    mutationFn: ({ id, location }: { id: string; location: LocationType }) =>
      userUseCase.updateLocation(id, location),
  });

  /** Escutar motorista específico em tempo real */
  const userListenerRef = useRef<null | (() => void)>(null);
  const listenUserRealtime = (
    id: string,
    onUpdate: (d: UserEntity) => void,
  ) => {
    if (userListenerRef.current) {
      userListenerRef.current(); // remove anterior
    }
    const unsubscribe = userUseCase.listenUserRealtime(id, onUpdate, err =>
      console.error('Erro listener motorista:', err),
    );
    userListenerRef.current = unsubscribe;
  };

  useEffect(() => {
    return () => {
      if (userListenerRef.current) userListenerRef.current();
    };
  }, []);

  return {
    // LISTA E PAGINAÇÃO
    users: usersResponse?.data ?? [],
    pagination: usersResponse?.pagination,
    isLoadingUsers: loading,
    error,
    refresh: refetch,

    // CRUD
    createUser,
    updateUser,
    updateUserAvailability,
    updateUserLocation,
    deleteUser,

    // CONSULTAS DIRETAS
    fetchUserById,
    fetchAllUsersByField,
    fetchOneUserByField,

    // REALTIME
    listenUserRealtime,
  };
}
