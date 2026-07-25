import type { RideRatesInterface } from '@/interfaces/IRideRates';
import type { RateType } from '@/types/ride';

/**
 * Converte "HH:mm" → minutos do dia
 */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Verifica se currentMinutes está dentro do intervalo [start, end],
 * considerando casos que atravessam a meia-noite.
 *
 * @param currentMinutes minutos atuais do dia (0–1439)
 * @param startMinutes hora de início em minutos (0–1439)
 * @param endMinutes hora de fim em minutos (0–1439)
 */
export function isWithinTimeRange(
  currentMinutes: number,
  startMinutes: number,
  endMinutes: number,
): boolean {
  // Caso normal: start < end (ex.: 06:30 até 17:30)
  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }

  // Caso cruzando a meia-noite: start > end (ex.: 22:00 até 05:00)
  // Nesse caso, o intervalo é "start → 23:59" OU "00:00 → end"
  return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
}

/**
 * Devolve o tarifário (day_rates/night_rates) aplicável agora — mesma
 * seleção usada em calculateFare() para o cálculo real do fare. Extraído
 * para aqui para que UI que precise de exibir valores desse tarifário
 * (ex: minutos de espera grátis) nunca divirja do que é realmente faturado.
 */
export function getCurrentRateCard(
  rideRates: RideRatesInterface,
  now: Date = new Date(),
): RateType {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const dayStart = timeToMinutes(rideRates.day_rates.start_time);
  const dayEnd = timeToMinutes(rideRates.day_rates.end_time);

  const nightStart = timeToMinutes(rideRates.night_rates.start_time);
  const nightEnd = timeToMinutes(rideRates.night_rates.end_time);

  if (isWithinTimeRange(currentMinutes, dayStart, dayEnd)) {
    return rideRates.day_rates;
  }
  if (isWithinTimeRange(currentMinutes, nightStart, nightEnd)) {
    return rideRates.night_rates;
  }

  // Caso fora do horário definido (ex: madrugada) — fallback para night_rates
  return rideRates.night_rates;
}
