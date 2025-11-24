// src/hooks/useNetwork.ts
import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export function useNetwork() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [details, setDetails] = useState<NetInfoState | null>(null);

  useEffect(() => {
    // Monitora mudanças
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable !== false);
      setDetails(state);
    });

    // Checa uma vez ao iniciar
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected && state.isInternetReachable !== false);
      setDetails(state);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected, details };
}
