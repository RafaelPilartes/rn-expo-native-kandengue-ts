// src/domain/usecases/complaintUseCase.ts
import { complaintRepository } from '@/modules/Api';
import { ComplaintEntity } from '@/core/entities/Complaint';
import type { ListResponseType } from '@/interfaces/IApiResponse';
import {
  ComplaintInterface,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintType,
} from '@/core/interfaces/IComplaintRepository';

export class ComplaintUseCase {
  private repository = complaintRepository;

  async create(
    complaint: Omit<ComplaintInterface, 'id'>,
  ): Promise<ComplaintEntity> {
    try {
      // Validações de negócio
      if (!complaint.user_id) {
        throw new Error('ID do usuário é obrigatório');
      }

      if (!complaint.subject || complaint.subject.trim().length < 5) {
        throw new Error('Assunto deve ter pelo menos 5 caracteres');
      }

      if (!complaint.description || complaint.description.trim().length < 10) {
        throw new Error('Descrição deve ter pelo menos 10 caracteres');
      }

      return await this.repository.create(complaint);
    } catch (error: any) {
      console.error('Erro ao criar reclamação:', error);
      throw new Error(error.message || 'Erro ao criar reclamação');
    }
  }

  async getById(id: string): Promise<ComplaintEntity | null> {
    try {
      return await this.repository.getById(id);
    } catch (error: any) {
      console.error(`Erro ao buscar reclamação ${id}:`, error);
      throw new Error(error.message || 'Erro ao buscar reclamação');
    }
  }

  async getByUserId(userId: string): Promise<ComplaintEntity[]> {
    try {
      return await this.repository.getByUserId(userId);
    } catch (error: any) {
      console.error(`Erro ao buscar reclamações do usuário ${userId}:`, error);
      throw new Error(error.message || 'Erro ao buscar reclamações');
    }
  }

  async getByDriverId(driverId: string): Promise<ComplaintEntity[]> {
    try {
      return await this.repository.getByDriverId(driverId);
    } catch (error: any) {
      console.error(
        `Erro ao buscar reclamações do motorista ${driverId}:`,
        error,
      );
      throw new Error(error.message || 'Erro ao buscar reclamações');
    }
  }

  async updateStatus(
    id: string,
    status: ComplaintStatus,
    adminNotes?: string,
  ): Promise<ComplaintEntity> {
    try {
      return await this.repository.updateStatus(id, status, adminNotes);
    } catch (error: any) {
      console.error(`Erro ao atualizar status da reclamação ${id}:`, error);
      throw new Error(error.message || 'Erro ao atualizar status');
    }
  }

  async updatePriority(
    id: string,
    priority: ComplaintPriority,
  ): Promise<ComplaintEntity> {
    try {
      const complaint = await this.repository.getById(id);
      if (!complaint) {
        throw new Error('Reclamação não encontrada');
      }

      complaint.updatePriority(priority);
      return await this.repository.update(id, { priority });
    } catch (error: any) {
      console.error(`Erro ao atualizar prioridade da reclamação ${id}:`, error);
      throw new Error(error.message || 'Erro ao atualizar prioridade');
    }
  }

  async addAttachment(
    id: string,
    attachmentUrl: string,
  ): Promise<ComplaintEntity> {
    try {
      return await this.repository.addAttachment(id, attachmentUrl);
    } catch (error: any) {
      console.error(`Erro ao adicionar anexo à reclamação ${id}:`, error);
      throw new Error(error.message || 'Erro ao adicionar anexo');
    }
  }

  async getStats(userId?: string): Promise<any> {
    try {
      return await this.repository.getStats(userId);
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas de reclamações:', error);
      throw new Error(error.message || 'Erro ao buscar estatísticas');
    }
  }

  async getAll(
    limit?: number,
    offset?: number,
    filters?: Partial<ComplaintInterface>,
  ): Promise<ListResponseType<ComplaintEntity[]>> {
    try {
      return await this.repository.getAll(limit, offset, filters);
    } catch (error: any) {
      console.error('Erro ao buscar reclamações:', error);
      throw new Error(error.message || 'Erro ao buscar reclamações');
    }
  }

  async update(
    id: string,
    complaint: Partial<ComplaintInterface>,
  ): Promise<ComplaintEntity> {
    try {
      return await this.repository.update(id, complaint);
    } catch (error: any) {
      console.error(`Erro ao atualizar reclamação ${id}:`, error);
      throw new Error(error.message || 'Erro ao atualizar reclamação');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const complaint = await this.repository.getById(id);
      if (!complaint) {
        throw new Error('Reclamação não encontrada');
      }

      if (!complaint.canBeDeleted()) {
        throw new Error('Reclamação não pode ser excluída no status atual');
      }

      await this.repository.delete(id);
    } catch (error: any) {
      console.error(`Erro ao excluir reclamação ${id}:`, error);
      throw new Error(error.message || 'Erro ao excluir reclamação');
    }
  }
}
