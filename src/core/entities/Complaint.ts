// src/core/entities/Complaint.ts
import {
  ComplaintInterface,
  ComplaintType,
  ComplaintStatus,
  ComplaintPriority,
  ContactPreference,
} from '../interfaces/IComplaintRepository';

export class ComplaintEntity implements ComplaintInterface {
  public id?: string;
  public user_id?: string;
  public driver_id?: string;
  public ride_id?: string;
  public type: ComplaintType;
  public subject: string;
  public description: string;
  public status: ComplaintStatus;
  public priority: ComplaintPriority;
  public contact_preference: ContactPreference;
  public attachments?: string[];
  public admin_notes?: string;
  public resolved_at?: Date;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(data: ComplaintInterface) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.driver_id = data.driver_id;
    this.ride_id = data.ride_id;
    this.type = data.type;
    this.subject = data.subject;
    this.description = data.description;
    this.status = data.status || 'open';
    this.priority = data.priority || 'medium';
    this.contact_preference = data.contact_preference || 'email';
    this.attachments = data.attachments || [];
    this.admin_notes = data.admin_notes || '';
    this.resolved_at = data.resolved_at;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.user_id) {
      errors.push('ID do usuário é obrigatório');
    }

    if (!this.type) {
      errors.push('Tipo da reclamação é obrigatório');
    }

    if (!this.subject || this.subject.trim().length < 5) {
      errors.push('Assunto deve ter pelo menos 5 caracteres');
    }

    if (!this.description || this.description.trim().length < 10) {
      errors.push('Descrição deve ter pelo menos 10 caracteres');
    }

    if (this.subject.length > 100) {
      errors.push('Assunto não pode ter mais de 100 caracteres');
    }

    if (this.description.length > 1000) {
      errors.push('Descrição não pode ter mais de 1000 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  canBeUpdated(): boolean {
    return this.status !== 'resolved' && this.status !== 'closed';
  }

  canBeDeleted(): boolean {
    return this.status === 'open';
  }

  markAsResolved(adminNotes?: string): void {
    this.status = 'resolved';
    this.resolved_at = new Date();
    this.updated_at = new Date();

    if (adminNotes) {
      this.admin_notes = adminNotes;
    }
  }

  updatePriority(priority: ComplaintPriority): void {
    this.priority = priority;
    this.updated_at = new Date();
  }

  addAttachment(attachmentUrl: string): void {
    if (!this.attachments) {
      this.attachments = [];
    }
    this.attachments.push(attachmentUrl);
    this.updated_at = new Date();
  }

  getEstimatedResolutionTime(): string {
    const priorityResolutionTimes = {
      urgent: '4-6 horas',
      high: '12-24 horas',
      medium: '2-3 dias',
      low: '5-7 dias',
    };

    return priorityResolutionTimes[this.priority] || '2-3 dias';
  }

  toJSON(): ComplaintInterface {
    return {
      id: this.id,
      user_id: this.user_id,
      driver_id: this.driver_id,
      ride_id: this.ride_id,
      type: this.type,
      subject: this.subject,
      description: this.description,
      status: this.status,
      priority: this.priority,
      contact_preference: this.contact_preference,
      attachments: this.attachments,
      admin_notes: this.admin_notes,
      resolved_at: this.resolved_at,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
