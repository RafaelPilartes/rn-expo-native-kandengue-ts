import type { RideRatesInterface } from '@/interfaces/IRideRates';
import { getCurrentRateCard } from './rideTime';
import { RideFareInterface } from '@/interfaces/IRideFare';

export function calculateFare(
  distanceKm: number,
  waitMinutes: number,
  rideRates: RideRatesInterface,
): RideFareInterface {
  const rate = getCurrentRateCard(rideRates);

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
      // gross_amount = total ANTES de qualquer desconto promocional aplicado.
      // Escrito sempre (mesmo sem promo) para auditoria consistente.
      gross_amount: round(finalTotal),
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
