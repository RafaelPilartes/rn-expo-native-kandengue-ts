// src/contexts/UserRidesContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/storage/store/useAuthStore';
import { useRidesViewModel } from '@/viewModels/RideViewModel';
import { RideInterface } from '@/interfaces/IRide';

interface UserRidesContextType {
  // Estado
  userRides: RideInterface[];
  activeRides: RideInterface[]; // MUDADO para plural
  completedRides: RideInterface[];
  isLoading: boolean;
  error: string | null;

  // Ações
  refreshUserRides: () => Promise<void>;
  loadMoreRides: () => Promise<void>;
  setActiveRide: (ride: RideInterface | null) => void;

  // Utilitários
  hasMoreRides: boolean;
  isRefreshing: boolean;
  currentActiveRide: RideInterface | null; // Para compatibilidade
}

export const UserRidesContext = createContext<UserRidesContextType>(
  {} as UserRidesContextType,
);

interface UserRidesProviderProps {
  children: React.ReactNode;
  autoLoad?: boolean;
  pageSize?: number;
}

export const UserRidesProvider: React.FC<UserRidesProviderProps> = ({
  children,
  autoLoad = true,
  pageSize = 30,
}) => {
  const { user } = useAuthStore();
  const { fetchAllRidesByField, listenAllByField } = useRidesViewModel();

  // Estados
  const [userRides, setUserRides] = useState<RideInterface[]>([]);
  const [activeRides, setActiveRides] = useState<RideInterface[]>([]); // MUDADO para array
  const [completedRides, setCompletedRides] = useState<RideInterface[]>([]);
  const [currentActiveRide, setCurrentActiveRide] =
    useState<RideInterface | null>(null); // Para compatibilidade
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreRides, setHasMoreRides] = useState(true);

  // 🔹 Filtrar corridas por status
  const filterRidesByStatus = (rides: RideInterface[]) => {
    const active = rides.filter(
      ride => ride.status !== 'completed' && ride.status !== 'canceled',
    );

    const completed = rides.filter(
      ride => ride.status === 'completed' || ride.status === 'canceled',
    );

    return { active, completed };
  };

  // 🔹 Buscar corridas do usuário
  const fetchUserRides = async (
    page: number = 0,
    isLoadMore: boolean = false,
  ) => {
    if (!user?.id) {
      setError('Usuário não autenticado');
      return;
    }

    try {
      if (!isLoadMore) {
        setIsLoading(true);
      }
      setError(null);

      const response = await fetchAllRidesByField(
        'user.id' as any,
        user.id,
        pageSize,
        page * pageSize,
      );

      const rides = response?.data || [];
      const { active, completed } = filterRidesByStatus(rides);

      if (isLoadMore) {
        // Adicionar às corridas existentes
        setUserRides(prev => [...prev, ...rides]);
        setActiveRides(prev => [...prev, ...active]);
        setCompletedRides(prev => [...prev, ...completed]);
      } else {
        // Substituir corridas existentes
        setUserRides(rides);
        setActiveRides(active);
        setCompletedRides(completed);
      }

      // Verificar se há mais corridas para carregar
      setHasMoreRides(rides.length === pageSize);

      // Definir corrida ativa principal automaticamente (a mais recente)
      if (!isLoadMore && active.length > 0) {
        const latestActiveRide = active[0];
        setCurrentActiveRide(latestActiveRide);
      } else if (!isLoadMore && active.length === 0) {
        setCurrentActiveRide(null);
      }
    } catch (err: any) {
      console.error('Erro ao buscar corridas do usuário:', err);
      setError(err.message || 'Erro ao carregar corridas');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // 🔹 Atualizar lista de corridas
  const refreshUserRides = async () => {
    setIsRefreshing(true);
    setCurrentPage(0);
    await fetchUserRides(0, false);
  };

  // 🔹 Carregar mais corridas
  const loadMoreRides = async () => {
    if (!hasMoreRides || isLoading) return;

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await fetchUserRides(nextPage, true);
  };

  // 🔹 Definir corrida ativa específica
  const setActiveRide = (ride: RideInterface | null) => {
    setCurrentActiveRide(ride);
  };

  // 🔹 Listener em tempo real para corridas ativas
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = listenAllByField(
      'user.id' as any,
      user.id,
      (updatedRides: RideInterface[]) => {
        const { active, completed } = filterRidesByStatus(updatedRides);

        // Atualizar todas as listas
        setUserRides(updatedRides);
        setActiveRides(active);
        setCompletedRides(completed);

        // Atualizar corrida ativa principal se necessário
        if (currentActiveRide) {
          const updatedActiveRide = active.find(
            ride => ride.id === currentActiveRide.id,
          );
          if (updatedActiveRide) {
            setCurrentActiveRide(updatedActiveRide);
          } else {
            // Se a corrida ativa foi completada/cancelada, definir nova ativa
            setCurrentActiveRide(active[0] || null);
          }
        } else if (active.length > 0) {
          // Se não há corrida ativa, definir a mais recente
          setCurrentActiveRide(active[0]);
        }
      },
    );

    return unsubscribe;
  }, [user?.id, currentActiveRide?.id]);

  // 🔹 Carregar corridas inicialmente
  useEffect(() => {
    if (autoLoad && user?.id) {
      fetchUserRides(0, false);
    }
  }, [user?.id, autoLoad]);

  // 🔹 Limpar dados ao deslogar
  useEffect(() => {
    if (!user) {
      setUserRides([]);
      setActiveRides([]);
      setCompletedRides([]);
      setCurrentActiveRide(null);
      setError(null);
    }
  }, [user]);

  const value: UserRidesContextType = {
    // Estado
    userRides,
    activeRides,
    completedRides,
    isLoading,
    error,

    // Ações
    refreshUserRides,
    loadMoreRides,
    setActiveRide,

    // Utilitários
    hasMoreRides,
    isRefreshing,
    currentActiveRide, // Para compatibilidade com código existente
  };

  return (
    <UserRidesContext.Provider value={value}>
      {children}
    </UserRidesContext.Provider>
  );
};

// 🔹 Hook personalizado para usar o contexto
export const useUserRides = () => {
  const context = useContext(UserRidesContext);

  if (!context) {
    throw new Error('useUserRides must be used within a UserRidesProvider');
  }

  return context;
};

// 🔹 Hook específico para corridas ativas
export const useActiveRides = () => {
  const { activeRides, currentActiveRide, setActiveRide } = useUserRides();

  return {
    activeRides,
    currentActiveRide,
    setActiveRide,

    // Utilitários para corridas ativas
    hasActiveRides: activeRides.length > 0,
    activeRidesCount: activeRides.length,

    // Filtrar por status específico
    pendingRides: activeRides.filter(ride => ride.status === 'idle'),
    inProgressRides: activeRides.filter(ride =>
      [
        'driver_on_the_way',
        'arrived_pickup',
        'picked_up',
        'arrived_dropoff',
      ].includes(ride.status),
    ),
  };
};

// 🔹 Hook específico para histórico de corridas
export const useRidesHistory = () => {
  const { completedRides, userRides, loadMoreRides, hasMoreRides, isLoading } =
    useUserRides();

  return {
    completedRides,
    allRides: userRides,
    loadMoreRides,
    hasMoreRides,
    isLoading,

    // Utilitários para histórico
    completedCount: completedRides.filter(ride => ride.status === 'completed')
      .length,
    canceledCount: completedRides.filter(ride => ride.status === 'canceled')
      .length,

    // Agrupar por data
    ridesByDate: completedRides.reduce((acc, ride) => {
      if (!ride.created_at) return acc;

      const date = new Date(ride.created_at).toLocaleDateString('pt-BR');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(ride);
      return acc;
    }, {} as Record<string, RideInterface[]>),
  };
};
