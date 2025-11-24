// src/screens/hooks/useFareCalculation.ts
import { useState, useEffect } from 'react';
import { RideRateEntity } from '@/core/entities/RideRate';
import { calculateFare } from '@/helpers/rideCalculate';
import { RideFareInterface } from '@/interfaces/IRideFare';

export function useFareCalculation(
  distanceKm: number,
  waitMinutes: number,
  rates: RideRateEntity | null,
) {
  const [fareDetails, setFareDetails] = useState<RideFareInterface | null>(
    null,
  );

  const handleCalculateFareSummary = (waitMinutesTotal: number) => {
    if (!rates) return;

    if (distanceKm && waitMinutesTotal) {
      const fare = calculateFare(distanceKm, waitMinutesTotal, rates);
      setFareDetails(fare);
    }
  };

  useEffect(() => {
    if (!rates) return;

    const fare = calculateFare(distanceKm, waitMinutes, rates);
    setFareDetails(fare);
  }, [distanceKm, waitMinutes, rates]);

  return { fareDetails, handleCalculateFareSummary };
}
