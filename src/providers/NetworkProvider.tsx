// src/providers/NetworkProvider.tsx
import React, { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isOnline = !!state.isConnected && !!state.isInternetReachable;
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
