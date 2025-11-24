import type { RideRatesInterface } from '@/interfaces/IRideRates';
import { isWithinTimeRange, timeToMinutes } from './rideTime';
import { RideFareInterface } from '@/interfaces/IRideFare';

export function calculateFare(
  distanceKm: number,
  waitMinutes: number,
  rideRates: RideRatesInterface,
): RideFareInterface {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const dayStart = timeToMinutes(rideRates.day_rates.start_time);
  const dayEnd = timeToMinutes(rideRates.day_rates.end_time);

  const nightStart = timeToMinutes(rideRates.night_rates.start_time);
  const nightEnd = timeToMinutes(rideRates.night_rates.end_time);

  let rate;
  if (isWithinTimeRange(currentMinutes, dayStart, dayEnd)) {
    rate = rideRates.day_rates;
  } else if (isWithinTimeRange(currentMinutes, nightStart, nightEnd)) {
    rate = rideRates.night_rates;
  } else {
    // Caso fora do horário definido (ex: madrugada) — fallback para nightRates
    rate = rideRates.night_rates;
  }

  // Calcular custos
  const extraWaitMinutes = Math.max(
    0,
    waitMinutes - rate.wait_time_free_minutes,
  );
  const distanceCost = distanceKm * rate.price_per_km;
  const waitCost = extraWaitMinutes * rate.price_per_minute;

  const subtotal = rate.base_fare + distanceCost + waitCost;
  const insuranceFee = (subtotal * rideRates.insurance_percent) / 100;
  const finalTotal = subtotal + insuranceFee;

  // Garantir arredondamento em valores monetários
  const round = (val: number) => Math.round(val);

  return {
    total: round(finalTotal),
    breakdown: {
      base_fare: round(rate.base_fare),
      distance_cost: round(distanceCost),
      wait_cost: round(waitCost),
      insurance_fee: round(insuranceFee),
    },
    payouts: {
      driver_earnings: round(
        (finalTotal * rideRates.payouts.driver_percent) / 100,
      ),
      company_earnings: round(
        (finalTotal * rideRates.payouts.company_percent) / 100,
      ),
      pension_fund: round(
        (finalTotal * rideRates.payouts.pension_fund_percent) / 100,
      ),
    },
  };
}
