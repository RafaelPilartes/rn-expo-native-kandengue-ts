import { useEffect, useState, useRef } from 'react';

type Props = {
  isWaiting: boolean;
  startDate?: Date | string | null; // data de início da espera
  endDate?: Date | string | null; // opcional: final da espera
  freeMinutes?: number; // minutos gratuitos
};

export function useWaitTimer(isWaiting: boolean, waitTime: number = 5) {
  const [elapsedTime, setElapsedTime] = useState(0); // segundos totais
  const [waitMinutes, setWaitMinutes] = useState(0); // minutos extras
  const [totalWaitMinutes, setTotalWaitMinutes] = useState(0); // minutos totais
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isWaiting) {
      // Start timer
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setElapsedTime(seg => seg + 1);
      }, 1000);
    } else {
      // pause but don't clear totalSeconds
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedTime(0);
      setWaitMinutes(0);
      setTotalWaitMinutes(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isWaiting]);

  // lógica do waitMinutes
  useEffect(() => {
    if (elapsedTime >= waitTime * 60) {
      const extraMinutes = Math.floor((elapsedTime - waitTime * 60) / 60);
      setWaitMinutes(extraMinutes);
    } else {
      setWaitMinutes(0);
    }
  }, [elapsedTime]);

  // 🆕 Minutos totais desde a chegada
  useEffect(() => {
    const minutes = Math.floor(elapsedTime / 60);
    setTotalWaitMinutes(minutes);
  }, [elapsedTime]);

  // formatar tempo em mm:ss
  const formattedTime = (() => {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  })();

  return {
    elapsedTime,
    formattedTime,
    totalWaitMinutes,
    waitMinutes,
  };
}
