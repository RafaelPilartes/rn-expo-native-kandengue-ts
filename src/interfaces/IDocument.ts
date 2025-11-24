import type { DocumentType } from '@/types/document';
import type { UserInterface } from './IUser';
import type { DocumentStatus } from '@/types/enum';

export interface DocumentInterface {
  id: string;
  user: UserInterface;
  label?: string;
  type: DocumentType; // "driver_license" | "id_front" | "id_back" | "vehicle_ownership" | "vehicle_booklet" | "other"
  url: string;
  status: DocumentStatus; // "pending" | "approved" | "rejected"
  vehicle_id?: string;
  feedback?: string;
  created_at?: Date;
  updated_at?: Date;
}
