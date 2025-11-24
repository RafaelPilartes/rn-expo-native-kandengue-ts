import { LocationContext } from '@/context/LocationContext';
import { useContext } from 'react';

export const useLocation = () => useContext(LocationContext);
