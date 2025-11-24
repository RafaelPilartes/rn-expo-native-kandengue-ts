// src/screens/hooks/useRideRealtime.ts
import { useEffect, useState } from 'react';
import { useRidesViewModel } from '@/viewModels/RideViewModel';
import { RideInterface } from '@/interfaces/IRide';

export function useRideRealtime(rideId?: string) {
  const { fetchRideById, listenRideRealtime } = useRidesViewModel();

  const [ride, setRide] = useState<RideInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rideId) {
      setRide(null);
      setIsLoading(false);
      return;
    }

    const setupRealtimeListener = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Primeiro busca os dados iniciais
        const initialRide = await fetchRideById(rideId);
        setRide(initialRide);
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao buscar corrida:', err);
        setError('Erro ao carregar dados da corrida');
        setIsLoading(false);
      }
    };

    setupRealtimeListener();

    const unsubscribe = listenRideRealtime(rideId, setRide);
    return () => unsubscribe;
  }, [rideId]);

  return { ride, isLoading, error };
}
