import { toDate } from '@/utils/formatDate';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

type Props = {
  isWaiting: boolean;
  startDate?: Date | string | null; // data de início da espera
  endDate?: Date | string | null; // opcional: final da espera
  freeMinutes?: number; // minutos gratuitos
};

export function useWaitTimerByDate({
  isWaiting,
  startDate,
  endDate,
  freeMinutes = 5,
}: Props) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /// ✅ Memoiza start/end para não mudar a referência em toda renderização
  const start = useMemo(() => toDate(startDate), [startDate]);
  const end = useMemo(() => toDate(endDate), [endDate]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Se não tem data de início OU não está esperando → reseta
    if (!start) {
      stopTimer();
      setElapsedSeconds(0);
      return;
    }

    // Se já tem endDate, calcula o tempo final e para
    if (end) {
      stopTimer();
      const diff = Math.floor((end.getTime() - start.getTime()) / 1000);
      setElapsedSeconds(diff >= 0 ? diff : 0);
      return;
    }

    // Sem endDate -> iniciar contador em tempo real
    stopTimer(); // garante que não cria múltiplos intervalos

    timerRef.current = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
      setElapsedSeconds(diff >= 0 ? diff : 0);
    }, 1000);

    return stopTimer;
  }, [isWaiting, startDate, endDate]);

  // ------------ CÁLCULOS DERIVADOS ------------------

  const totalMinutes = Math.floor(elapsedSeconds / 60);

  // minutos extras além dos gratuitos
  const extraMinutes =
    totalMinutes > freeMinutes ? totalMinutes - freeMinutes : 0;

  // mm:ss formatado
  const formatted = useMemo(() => {
    const m = Math.floor(elapsedSeconds / 60);
    const s = elapsedSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [elapsedSeconds]);

  return {
    elapsedSeconds,
    formatted,
    totalMinutes,
    extraMinutes,
  };
}
