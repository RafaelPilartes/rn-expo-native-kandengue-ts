// core/entities/Ride.ts
import type { DriverInterface } from '@/interfaces/IDriver';
import type { RideInterface } from '@/interfaces/IRide';
import type { RideFareInterface } from '@/interfaces/IRideFare';
import type { UserInterface } from '@/interfaces/IUser';
import type { RideStatusType, RideType } from '@/types/enum';
import type { GeoLocationType } from '@/types/geoLocation';
import type { RideDetailsType } from '@/types/ride';

export class RideEntity implements RideInterface {
  id?: string;
  user: UserInterface;
  driver?: DriverInterface;
  pickup: GeoLocationType;
  dropoff: GeoLocationType;
  status: RideStatusType;

  distance: number;
  duration: number;

  fare: RideFareInterface;

  type: RideType;
  otp_code?: string;
  cancel_reason?: string;
  details?: RideDetailsType;

  proof_pickup_photo?: string;
  proof_dropoff_photo?: string;
  waiting_start_at?: Date;
  waiting_end_at?: Date;

  completed_at?: Date;
  canceled_at?: Date;

  // Promoções (replicação manual — fonte de verdade: "08 — Firestore Schema")
  promotion_id?: string;
  promotion_usage_id?: string;
  driver_matched_at?: Date | null;
  cancelled_by?: 'driver' | 'user' | 'system';

  created_at?: Date;
  updated_at?: Date;

  constructor(params: RideInterface) {
    this.id = params.id;
    this.user = params.user;
    this.driver = params.driver;
    this.pickup = params.pickup;
    this.dropoff = params.dropoff;
    this.status = params.status;

    this.fare = params.fare;

    this.distance = params.distance;
    this.duration = params.duration;

    this.type = params.type;
    this.otp_code = params.otp_code;
    this.cancel_reason = params.cancel_reason;
    this.details = params.details;

    this.proof_pickup_photo = params.proof_pickup_photo;
    this.proof_dropoff_photo = params.proof_dropoff_photo;
    this.waiting_start_at = params.waiting_start_at;
    this.waiting_end_at = params.waiting_end_at;

    this.completed_at = params.completed_at;
    this.canceled_at = params.canceled_at;

    this.promotion_id = params.promotion_id;
    this.promotion_usage_id = params.promotion_usage_id;
    this.driver_matched_at = params.driver_matched_at;
    this.cancelled_by = params.cancelled_by;

    this.created_at = params.created_at;
    this.updated_at = params.updated_at;
  }
}
