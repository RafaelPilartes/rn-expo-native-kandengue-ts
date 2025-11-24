// src/domain/usecases/rideRatesUseCase.ts;
import { rideRateRepository } from '@/modules/Api';
import { RideRateEntity } from '@/core/entities/RideRate';
import type { ListResponseType } from '@/interfaces/IApiResponse';

export class RideRateUseCase {
  private repository = rideRateRepository;

  async getAll(
    limit?: number,
    offset?: number,
    searchTerm?: string,
    filters?: Partial<RideRateEntity>,
  ): Promise<ListResponseType<RideRateEntity[]>> {
    try {
      return await this.repository.getAll(limit, offset, searchTerm, filters);
    } catch (error: any) {
      console.error('Erro ao buscar taxa de viagem:', error);
      throw new Error(error.message || 'Erro ao buscar taxa de viagem');
    }
  }

  async getById(id: string): Promise<RideRateEntity | null> {
    try {
      return await this.repository.getById(id);
    } catch (error: any) {
      console.error(`Erro ao buscar taxa de viagem ${id}:`, error);
      throw new Error(error.message || 'Erro ao buscar taxa de viagem');
    }
  }

  // get one by custom field
  async getOneByField(
    field: string,
    value: any,
  ): Promise<RideRateEntity | null> {
    try {
      return await this.repository.getOneByField(field, value);
    } catch (error: any) {
      console.error(`Erro ao buscar rideRate por ${field}-${value}:`, error);
      throw new Error(error.message || 'Erro ao buscar rideRate');
    }
  }

  // get by custom field
  async getAllByField(
    field: string,
    value: any,
    limit?: number,
    offset?: number,
  ): Promise<ListResponseType<RideRateEntity[]>> {
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
        `Erro ao buscar taxa de viagem pelo campo ${field} com valor ${value}:`,
        error,
      );
      throw new Error(error.message || 'Erro ao buscar taxa de viagem');
    }
  }

  async create(rideRate: Omit<RideRateEntity, 'id'>): Promise<RideRateEntity> {
    try {
      return await this.repository.create(rideRate);
    } catch (error: any) {
      console.error('Erro ao criar taxa de viagem:', error);
      throw new Error(error.message || 'Erro ao criar taxa de viagem');
    }
  }

  async update(
    id: string,
    rideRate: Partial<RideRateEntity>,
  ): Promise<RideRateEntity> {
    try {
      return await this.repository.update(id, rideRate);
    } catch (error: any) {
      console.error(`Erro ao atualizar taxa de viagem ${id}:`, error);
      throw new Error(error.message || 'Erro ao atualizar taxa de viagem');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.repository.delete(id);
    } catch (error: any) {
      console.error(`Erro ao deletar taxa de viagem ${id}:`, error);
      throw new Error(error.message || 'Erro ao deletar taxa de viagem');
    }
  }

  // Escuta todas as atualizações
  listenAll(
    onUpdate: (rides: RideRateEntity[]) => void,
    onError?: (err: Error) => void,
    options: {
      filters?: Partial<RideRateEntity>;
      limit?: number;
      orderBy?: keyof RideRateEntity;
      orderDirection?: 'asc' | 'desc';
    } = {},
  ) {
    try {
      return this.repository.listenAll(onUpdate, onError, options);
    } catch (error: any) {
      console.error('Erro ao escutar taxas de viagem:', error);
      throw new Error(error.message || 'Erro ao escutar taxas de viagem');
    }
  }
}
