// src/core/interfaces/IComplaintRepository.ts
import { ComplaintEntity } from '../entities/Complaint';
import type { ListResponseType } from '@/interfaces/IApiResponse';

export interface ComplaintInterface {
  id?: string;
  user_id?: string;
  driver_id?: string;
  ride_id?: string;
  type: ComplaintType;
  subject: string;
  description: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  contact_preference: ContactPreference;
  attachments?: string[];
  admin_notes?: string;
  resolved_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export type ComplaintType =
  | 'service_quality'
  | 'driver_behavior'
  | 'payment_issue'
  | 'app_technical'
  | 'safety_concern'
  | 'lost_item'
  | 'other';

export type ComplaintStatus =
  | 'open'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'rejected';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ContactPreference =
  | 'email'
  | 'phone'
  | 'whatsapp'
  | 'app_notification';

export interface IComplaintRepository {
  // CRUD Operations
  getAll(
    limit?: number,
    offset?: number,
    filters?: Partial<ComplaintInterface>,
  ): Promise<ListResponseType<ComplaintEntity[]>>;

  getById(id: string): Promise<ComplaintEntity | null>;
  getByUserId(userId: string): Promise<ComplaintEntity[]>;
  getByDriverId(driverId: string): Promise<ComplaintEntity[]>;

  create(complaint: Omit<ComplaintInterface, 'id'>): Promise<ComplaintEntity>;
  update(
    id: string,
    complaint: Partial<ComplaintInterface>,
  ): Promise<ComplaintEntity>;
  delete(id: string): Promise<void>;

  // Specialized queries
  getByStatus(status: ComplaintStatus): Promise<ComplaintEntity[]>;
  getByPriority(priority: ComplaintPriority): Promise<ComplaintEntity[]>;
  getByType(type: ComplaintType): Promise<ComplaintEntity[]>;

  // Admin operations
  updateStatus(
    id: string,
    status: ComplaintStatus,
    adminNotes?: string,
  ): Promise<ComplaintEntity>;
  assignToAdmin(id: string, adminId: string): Promise<ComplaintEntity>;
  addAttachment(id: string, attachmentUrl: string): Promise<ComplaintEntity>;

  // Analytics
  getStats(userId?: string): Promise<{
    total: number;
    open: number;
    in_progress: number;
    resolved: number;
    by_type: Record<ComplaintType, number>;
    by_priority: Record<ComplaintPriority, number>;
  }>;
}
