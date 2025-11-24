// src/screens/hooks/useRideSummary.ts
import { useEffect, useState } from 'react';
import { useWaitTimerByDate } from './useWaitTimerByDate';
import { useRideRatesViewModel } from '@/viewModels/RideRateViewModel';
import { RideRateEntity } from '@/core/entities/RideRate';
import { useRideRealtime } from './ride/useRideRealtime';
import { useRideRoute } from './ride/useRideRoute';
import { useRideFlow } from './ride/useRideFlow';
import { useFareCalculation } from './ride/useFareCalculation';
import { RideStatusType } from '@/types/enum';
import { isWithinTimeRange, timeToMinutes } from '@/helpers/rideTime';
import { RateType } from '@/types/ride';

export function useRideSummary(rideId?: string) {
  const initial: RideStatusType = 'idle';

  // Estados principais
  const [loading, setLoading] = useState(true);
  const [rateByTime, setRateByTime] = useState<RateType | null>(null);
  const [rideStatus, setRideStatus] = useState<RideStatusType>(initial);
  const [rideRates, setRideRates] = useState<RideRateEntity | null>(null);

  // HOOKS PRINCIPAIS
  const { ride, isLoading: isLoadingRide } = useRideRealtime(rideId);
  const { listenAll: listenRates } = useRideRatesViewModel();

  // CÁLCULOS DE ROTA
  const { routeCoords, distanceKm, durationMinutes, distance, duration } =
    useRideRoute(ride?.pickup, ride?.dropoff);

  // ROTA DO MOTORISTA (se existir)
  const {
    routeCoords: routeCoordsDriver,
    distanceKm: distanceKmDriver,
    durationMinutes: durationMinutesDriver,
    distance: distanceDriver,
    duration: durationDriver,
  } = useRideRoute(
    ride?.driver?.location,
    ride?.status === 'picked_up' ? ride.dropoff : ride?.pickup,
  );

  // TEMPO DE ESPERA
  const { formatted, extraMinutes, totalMinutes, elapsedSeconds } =
    useWaitTimerByDate({
      isWaiting: rideStatus === 'arrived_pickup',
      startDate: ride?.waiting_start_at,
      endDate: ride?.waiting_end_at,
      freeMinutes: rateByTime?.wait_time_free_minutes,
    });

  // CÁLCULO DA TARIFA
  const { fareDetails, handleCalculateFareSummary } = useFareCalculation(
    distanceKm,
    totalMinutes ?? 0,
    rideRates ?? null,
  );

  // FLUXO DA CORRIDA (ATUALIZADO PARA USUÁRIO)
  const {
    create: handleCreateRide,
    confirm: handleConfirmRide,
    arrivedPickup: handleArrivedToPickup,
    pickedUp: handlePickedUpRide,
    arrivedDropoff: handleArrivedToDropoff,
    completed: handleCompletedRide,
    canceled: handleCanceledRide,
  } = useRideFlow(rideId, fareDetails);

  // Atualizar status quando a corrida m
  useEffect(() => {
    if (ride?.status) {
      setRideStatus(ride.status);
    }
  }, [ride?.status]);

  // Carregar taxas
  useEffect(() => {
    const unsubscribe = listenRates((rates: RideRateEntity[]) => {
      if (!rates) return;
      setRideRates(rates[0]);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Se não tem rideId, não precisa carregar dados da corrida
    if (!rideId) {
      setLoading(true);
      return;
    }

    // Se tem rideId, espera os dados da corrida carregarem
    if (!isLoadingRide && ride) {
      setLoading(false);
    }

    // Se tem routeCoords e fareDetails
    if (routeCoords.length > 0 && fareDetails) {
      setLoading(false);
    }
  }, [
    routeCoords,
    fareDetails,
    routeCoordsDriver,
    rideId,
    isLoadingRide,
    ride,
  ]);

  // Calcular taxa baseada no horário
  useEffect(() => {
    if (!rideRates) return;

    const currentRate = rideRates;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const dayStart = timeToMinutes(currentRate.day_rates.start_time);
    const dayEnd = timeToMinutes(currentRate.day_rates.end_time);

    const nightStart = timeToMinutes(currentRate.night_rates.start_time);
    const nightEnd = timeToMinutes(currentRate.night_rates.end_time);

    let rate;
    if (isWithinTimeRange(currentMinutes, dayStart, dayEnd)) {
      rate = currentRate.day_rates;
    } else if (isWithinTimeRange(currentMinutes, nightStart, nightEnd)) {
      rate = currentRate.night_rates;
    } else {
      rate = currentRate.night_rates;
    }

    setRateByTime(rate);
  }, [rideRates]);

  return {
    ride,
    loading,
    routeCoords,
    distance,
    duration,
    distanceKm,
    durationMinutes,
    fareDetails,
    rideStatus,
    rideRates,

    // Rota do motorista
    routeCoordsDriver,
    distanceDriver,
    durationDriver,
    distanceKmDriver,
    durationMinutesDriver,

    // tempo
    currentTime: formatted,
    additionalTime: extraMinutes,
    elapsedSeconds,
    totalMinutes,

    // ações
    handleCreateRide, // Motorista criou a entrega
    handleConfirmRide, // Motorista confirmou a entrega
    handleArrivedToPickup, // Motorista chegou ao local de entrega
    handlePickedUpRide, // Motorista pegou o pacote
    handleArrivedToDropoff, // Motorista chegou ao local de entrega
    handleCompletedRide, // Motorista entregou o pacote
    handleCanceledRide, // Motorista cancelou a entrega
    handleCalculateFareSummary,

    handleCancelFindRide: handleCanceledRide,
  };
}
