// viewModels/AdminViewModel.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminUseCase } from '@/domain/usecases/adminsUseCase';
import { AdminEntity } from '@/core/entities/Admin';
import type { ListResponseType } from '@/interfaces/IApiResponse';
import { firebaseCollections } from '@/constants/firebaseCollections';
import { useMemo } from 'react';

const adminUseCase = new AdminUseCase();

export function useAdminsViewModel(
  limit?: number,
  offset?: number,
  searchTerm?: string,
  filters?: Partial<AdminEntity>,
) {
  const queryClient = useQueryClient();

  const filtersKey = filters ? JSON.stringify(filters) : '';

  /** Buscar lista de administradores */
  const {
    data: adminsResponse,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ListResponseType<AdminEntity[]>>({
    queryKey: [
      firebaseCollections.admins.root,
      limit,
      offset,
      searchTerm,
      filtersKey,
    ],
    queryFn: () => adminUseCase.getAll(limit, offset, searchTerm, filters),
    staleTime: 1000 * 60, // cache 1min
  });

  /** Buscar admin por field */
  const fetchOneAdminByField = async (
    field: keyof AdminEntity,
    value: string,
  ) => {
    try {
      return await adminUseCase.getOneByField(field, value);
    } catch (err) {
      console.error('Erro ao buscar admin por campo:', err);
      return null;
    }
  };

  /** Buscar lista de administradores por field */
  const fetchAllAdminsByField = async (
    field: string,
    value: any,
    limit?: number,
    offset?: number,
  ) => {
    try {
      return await adminUseCase.getAllByField(field, value, limit, offset);
    } catch (err) {
      console.error('Erro ao buscar administradores por campo:', err);
      return null;
    }
  };

  // const {
  //   data: adminsByFieldResponse,
  //   isLoading: loadingByField,
  //   error: errorByField
  // } = useQuery<ListResponseType<AdminEntity[]>>({
  //   queryKey: ['adminsByField', field, value, limit, offset],
  //   queryFn: () => adminUseCase.getAllByField(field as string, value),
  //   enabled: !!field,
  //   staleTime: 1000 * 60 // cache 1min
  // })

  /** Criar administrador */
  const createAdmin = useMutation({
    mutationFn: (admin: Omit<AdminEntity, 'id'>) => adminUseCase.create(admin),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.admins.root],
      });
    },
  });

  /** Atualizar administrador */
  const updateAdmin = useMutation({
    mutationFn: ({ id, admin }: { id: string; admin: Partial<AdminEntity> }) =>
      adminUseCase.update(id, admin),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.admins.root],
      });
    },
  });

  /** Deletar administrador */
  const deleteAdmin = useMutation({
    mutationFn: (id: string) => adminUseCase.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.admins.root],
      });
    },
  });

  /** Buscar administrador único (on-demand) */
  const fetchAdminById = async (id: string) => {
    try {
      return await adminUseCase.getById(id);
    } catch (err) {
      console.error('Erro ao buscar administrador:', err);
      return null;
    }
  };

  /** Buscar administrador único (on-demand) */
  const fetchAdminByEmail = async (email: string) => {
    try {
      return await adminUseCase.getByEmail(email);
    } catch (err) {
      console.error('Erro ao buscar administrador:', err);
      return null;
    }
  };

  return {
    admins: adminsResponse?.data ?? [],
    pagination: adminsResponse?.pagination,
    isLoadingAdmins: loading,
    error,
    refresh: refetch,

    fetchAllAdminsByField,
    fetchOneAdminByField,
    fetchAdminByEmail,

    createAdmin,
    updateAdmin,
    deleteAdmin,
    fetchAdminById,
  };
}
