// src/domain/usecases/transactionsUseCase.ts;
import { transactionRepository } from '@/modules/Api';
import { TransactionEntity } from '@/core/entities/Transaction';
import type { ListResponseType } from '@/interfaces/IApiResponse';

export class TransactionUseCase {
  private repository = transactionRepository;

  async getAll(
    limit?: number,
    offset?: number,
    searchTerm?: string,
    filters?: Partial<TransactionEntity>,
  ): Promise<ListResponseType<TransactionEntity[]>> {
    try {
      return await this.repository.getAll(limit, offset, searchTerm, filters);
    } catch (error: any) {
      console.error('Erro ao buscar transações:', error);
      throw new Error(error.message || 'Erro ao buscar transações');
    }
  }

  async getById(id: string): Promise<TransactionEntity | null> {
    try {
      return await this.repository.getById(id);
    } catch (error: any) {
      console.error(`Erro ao buscar transação ${id}:`, error);
      throw new Error(error.message || 'Erro ao buscar transação');
    }
  }

  // get one by custom field
  async getOneByField(
    field: string,
    value: any,
  ): Promise<TransactionEntity | null> {
    try {
      return await this.repository.getOneByField(field, value);
    } catch (error: any) {
      console.error(`Erro ao buscar transaction por ${field}-${value}:`, error);
      throw new Error(error.message || 'Erro ao buscar transaction');
    }
  }

  // get by custom field
  async getAllByField(
    field: string,
    value: any,
    limit?: number,
    offset?: number,
  ): Promise<ListResponseType<TransactionEntity[]>> {
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
        `Erro ao buscar transação pelo campo ${field} com valor ${value}:`,
        error,
      );
      throw new Error(error.message || 'Erro ao buscar transação');
    }
  }

  async create(
    transaction: Omit<TransactionEntity, 'id'>,
  ): Promise<TransactionEntity> {
    try {
      return await this.repository.create(transaction);
    } catch (error: any) {
      console.error('Erro ao criar transação:', error);
      throw new Error(error.message || 'Erro ao criar transação');
    }
  }

  async update(
    id: string,
    transaction: Partial<TransactionEntity>,
  ): Promise<TransactionEntity> {
    try {
      return await this.repository.update(id, transaction);
    } catch (error: any) {
      console.error(`Erro ao atualizar transação ${id}:`, error);
      throw new Error(error.message || 'Erro ao atualizar transação');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.repository.delete(id);
    } catch (error: any) {
      console.error(`Erro ao deletar transação ${id}:`, error);
      throw new Error(error.message || 'Erro ao deletar transação');
    }
  }
}
