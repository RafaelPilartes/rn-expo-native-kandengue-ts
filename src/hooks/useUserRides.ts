import { UserRidesContext } from '@/context/UserRidesContext';
import { useContext } from 'react';

export const useUserRides = () => {
  const context = useContext(UserRidesContext);
  if (!context) {
    throw new Error('useUserRides must be used within a UserRidesProvider');
  }
  return context;
};
