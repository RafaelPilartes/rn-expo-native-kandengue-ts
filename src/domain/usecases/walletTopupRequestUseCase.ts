// src/domain/usecases/walletTopupRequestsUseCase.ts;
import { walletTopupRequestRepository } from '@/modules/Api';
import { WalletTopupRequestEntity } from '@/core/entities/WalletTopupRequest';
import type { ListResponseType } from '@/interfaces/IApiResponse';

export class WalletTopupRequestUseCase {
  private repository = walletTopupRequestRepository;

  async getAll(
    limit?: number,
    offset?: number,
    searchTerm?: string,
    filters?: Partial<WalletTopupRequestEntity>,
  ): Promise<ListResponseType<WalletTopupRequestEntity[]>> {
    try {
      return await this.repository.getAll(limit, offset, searchTerm, filters);
    } catch (error: any) {
      console.error('Erro ao buscar carteiras:', error);
      throw new Error(error.message || 'Erro ao buscar carteiras');
    }
  }

  async getById(id: string): Promise<WalletTopupRequestEntity | null> {
    try {
      return await this.repository.getById(id);
    } catch (error: any) {
      console.error(`Erro ao buscar carteira ${id}:`, error);
      throw new Error(error.message || 'Erro ao buscar carteira');
    }
  }

  // get one by custom field
  async getOneByField(
    field: string,
    value: any,
  ): Promise<WalletTopupRequestEntity | null> {
    try {
      return await this.repository.getOneByField(field, value);
    } catch (error: any) {
      console.error(
        `Erro ao buscar walletTopupRequest por ${field}-${value}:`,
        error,
      );
      throw new Error(error.message || 'Erro ao buscar walletTopupRequest');
    }
  }

  // get by custom field
  async getAllByField(
    field: string,
    value: any,
    limit?: number,
    offset?: number,
  ): Promise<ListResponseType<WalletTopupRequestEntity[]>> {
    try {
      const { data, pagination } = await this.repository.getAllByField(
        field,
        value,
        limit,
        offset,
      );

      return { data, pagination };
    } catch (error: any) {
      console.error(
        `Erro ao buscar carteira pelo campo ${field} com valor ${value}:`,
        error,
      );
      throw new Error(error.message || 'Erro ao buscar carteira');
    }
  }

  async create(
    walletTopupRequest: Omit<WalletTopupRequestEntity, 'id'>,
  ): Promise<WalletTopupRequestEntity> {
    try {
      return await this.repository.create(walletTopupRequest);
    } catch (error: any) {
      console.error('Erro ao criar carteira:', error);
      throw new Error(error.message || 'Erro ao criar carteira');
    }
  }

  async update(
    id: string,
    walletTopupRequest: Partial<WalletTopupRequestEntity>,
  ): Promise<WalletTopupRequestEntity> {
    try {
      return await this.repository.update(id, walletTopupRequest);
    } catch (error: any) {
      console.error(`Erro ao atualizar carteira ${id}:`, error);
      throw new Error(error.message || 'Erro ao atualizar carteira');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.repository.delete(id);
    } catch (error: any) {
      console.error(`Erro ao deletar carteira ${id}:`, error);
      throw new Error(error.message || 'Erro ao deletar carteira');
    }
  }
}
