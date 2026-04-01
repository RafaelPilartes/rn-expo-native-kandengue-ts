import { UserEntity } from './User';
import type { DriverInterface } from '@/interfaces/IDriver';
import type { VehicleInterface } from '@/interfaces/IVehicle';
import type { LocationType } from '@/types/geoLocation';

export class DriverEntity extends UserEntity implements DriverInterface {
  is_online: boolean;
  is_invisible?: boolean;
  vehicle?: VehicleInterface;
  rating?: number;
  current_location?: LocationType;

  constructor(params: DriverInterface) {
    super(params);
    this.is_online = params.is_online;
    this.is_invisible = params.is_invisible;
    this.vehicle = params.vehicle;
    this.rating = params.rating;
    this.current_location = params.current_location;
  }
}
