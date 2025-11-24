// viewModels/WalletViewModel.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WalletUseCase } from '@/domain/usecases/walletUseCase';
import { WalletEntity } from '@/core/entities/Wallet';
import type { ListResponseType } from '@/interfaces/IApiResponse';
import { firebaseCollections } from '@/constants/firebaseCollections';
import { useEffect, useMemo, useRef } from 'react';

const walletUseCase = new WalletUseCase();

export function useWalletsViewModel(
  limit?: number,
  offset?: number,
  searchTerm?: string,
  filters?: Partial<WalletEntity>,
) {
  const queryClient = useQueryClient();

  const filtersKey = filters ? JSON.stringify(filters) : '';

  /** Buscar lista de Carteiras */
  const {
    data: walletsResponse,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ListResponseType<WalletEntity[]>>({
    queryKey: [
      firebaseCollections.wallets.root,
      limit,
      offset,
      searchTerm,
      filtersKey,
    ],
    queryFn: () => walletUseCase.getAll(limit, offset, searchTerm, filters),
    staleTime: 1000 * 60, // cache 1min
  });

  // transforma os dados em formato exportável
  const dataToExport = useMemo(() => {
    if (!walletsResponse?.data) return [];
    return walletsResponse?.data.map(doc => ({
      Id: doc.id,
      Nome: doc.user.name,
      Email: doc.user.email,
      Telefone: doc.user.phone,
      'Data de criação': doc.created_at,
      'Última atualização': doc.updated_at,
    }));
  }, [walletsResponse?.data]);

  /** Buscar lista de Carteiras por field */
  const fetchAllWalletsByField = async (
    field: string,
    value: any,
    limit?: number,
    offset?: number,
  ) => {
    try {
      return await walletUseCase.getAllByField(field, value, limit, offset);
    } catch (err) {
      console.error('Erro ao buscar carteiras por campo:', err);
      return null;
    }
  };

  /** Criar carteira */
  const createWallet = useMutation({
    mutationFn: async (wallet: Omit<WalletEntity, 'id'>) => {
      return walletUseCase.create(wallet);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.wallets.root],
      });
    },
  });

  /** Atualizar carteira */
  const updateWallet = useMutation({
    mutationFn: ({
      id,
      wallet,
    }: {
      id: string;
      wallet: Partial<WalletEntity>;
    }) => walletUseCase.update(id, wallet),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.wallets.root],
      });
    },
  });

  /** Deletar carteira */
  const deleteWallet = useMutation({
    mutationFn: async (id: string) => {
      return walletUseCase.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [firebaseCollections.wallets.root],
      });
    },
  });

  /** Buscar carteira único (on-demand) */
  const fetchWalletById = async (id: string) => {
    try {
      return await walletUseCase.getById(id);
    } catch (err) {
      console.error('Erro ao buscar carteira:', err);
      return null;
    }
  };

  /** Buscar wallet por field */
  const fetchOneWalletByField = async (
    field: keyof WalletEntity,
    value: string,
  ) => {
    try {
      return await walletUseCase.getOneByField(field, value);
    } catch (err) {
      console.error('Erro ao buscar carteira por campo:', err);
      return null;
    }
  };

  /** Escutar Wallet pelo campo em tempo real */
  const fieldListenerRef = useRef<null | (() => void)>(null);
  const listenByField = (
    field: keyof WalletEntity,
    value: string,
    onUpdate: (d: WalletEntity) => void,
  ) => {
    if (fieldListenerRef.current) {
      fieldListenerRef.current(); // remove anterior
    }
    const unsubscribe = walletUseCase.listenByField(
      field,
      value,
      onUpdate,
      err => console.error('Erro listener motorista:', err),
    );
    fieldListenerRef.current = unsubscribe;
  };

  useEffect(() => {
    return () => {
      if (fieldListenerRef.current) fieldListenerRef.current();
    };
  }, []);

  return {
    wallets: walletsResponse?.data ?? [],
    pagination: walletsResponse?.pagination,
    isLoadingWallets: loading,
    error,
    refresh: refetch,

    fetchAllWalletsByField,
    fetchOneWalletByField,

    createWallet,
    updateWallet,
    deleteWallet,
    fetchWalletById,

    listenByField,

    dataToExport,
  };
}
