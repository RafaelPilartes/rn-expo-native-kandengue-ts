import type { UserInterface } from './IUser';
import type { VehicleInterface } from './IVehicle';
import type { LocationType } from '@/types/geoLocation';

export interface DriverInterface extends UserInterface {
  vehicle?: VehicleInterface;
  rating?: number;
  is_online: boolean;
  is_invisible?: boolean;
  current_location?: LocationType;
}
