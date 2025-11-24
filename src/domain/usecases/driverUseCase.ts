// src/domain/usecases/driversUseCase.ts;
import { driverRepository } from '@/modules/Api';
import { DriverEntity } from '@/core/entities/Driver';
import type { ListResponseType } from '@/interfaces/IApiResponse';
import { LocationType } from '@/types/geoLocation';

export class DriverUseCase {
  private repository = driverRepository;

  async getAll(
    limit?: number,
    offset?: number,
    searchTerm?: string,
    filters?: Partial<DriverEntity>,
  ): Promise<ListResponseType<DriverEntity[]>> {
    try {
      return await this.repository.getAll(limit, offset, searchTerm, filters);
    } catch (error: any) {
      console.error('Erro ao buscar motoristas:', error);
      throw new Error(error.message || 'Erro ao buscar motoristas');
    }
  }

  async getById(id: string): Promise<DriverEntity | null> {
    try {
      return await this.repository.getById(id);
    } catch (error: any) {
      console.error(`Erro ao buscar motorista ${id}:`, error);
      throw new Error(error.message || 'Erro ao buscar motorista');
    }
  }

  // get one by custom field
  async getOneByField(field: string, value: any): Promise<DriverEntity | null> {
    try {
      return await this.repository.getOneByField(field, value);
    } catch (error: any) {
      console.error(`Erro ao buscar driver por ${field}-${value}:`, error);
      throw new Error(error.message || 'Erro ao buscar driver');
    }
  }

  // get by custom field
  async getAllByField(
    field: string,
    value: any,
    limit?: number,
    offset?: number,
  ): Promise<ListResponseType<DriverEntity[]>> {
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
        `Erro ao buscar motorista pelo campo ${field} com valor ${value}:`,
        error,
      );
      throw new Error(error.message || 'Erro ao buscar motorista');
    }
  }

  async getByEmail(email: string): Promise<DriverEntity | null> {
    try {
      return await this.repository.getByEmail(email);
    } catch (error: any) {
      console.error(`Erro ao buscar motorista ${email}:`, error);
      throw new Error(error.message || 'Erro ao buscar motorista');
    }
  }

  async create(driver: Omit<DriverEntity, 'id'>): Promise<DriverEntity> {
    if (!driver.name || !driver.email) {
      throw new Error('Nome e email são obrigatórios');
    }

    try {
      return await this.repository.create(driver);
    } catch (error: any) {
      console.error('Erro ao criar motorista:', error);
      throw new Error(error.message || 'Erro ao criar motorista');
    }
  }

  async update(
    id: string,
    driver: Partial<DriverEntity>,
  ): Promise<DriverEntity> {
    try {
      return await this.repository.update(id, driver);
    } catch (error: any) {
      console.error(`Erro ao atualizar motorista ${id}:`, error);
      throw new Error(error.message || 'Erro ao atualizar motorista');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.repository.delete(id);
    } catch (error: any) {
      console.error(`Erro ao deletar motorista ${id}:`, error);
      throw new Error(error.message || 'Erro ao deletar motorista');
    }
  }

  /** Atualizar disponibilidade operacional (available/on_mission/offline) */
  async updateAvailability(
    id: string,
    availability: DriverEntity['availability'],
  ): Promise<void> {
    try {
      await this.repository.updateAvailability(id, availability);
    } catch (error: any) {
      console.error(
        `Erro ao atualizar disponibilidade do motorista ${id}:`,
        error,
      );
      throw new Error(
        error.message || 'Erro ao atualizar disponibilidade do motorista',
      );
    }
  }

  /** Atualizar localização em tempo real */
  async updateLocation(id: string, location: LocationType): Promise<void> {
    try {
      await this.repository.updateLocation(id, location);
    } catch (error: any) {
      console.error(`Erro ao atualizar localização do motorista ${id}:`, error);
      throw new Error(
        error.message || 'Erro ao atualizar localização do motorista',
      );
    }
  }

  /** Escutar mudanças em tempo real de um motorista específico */
  listenDriverRealtime(
    id: string,
    onUpdate: (driver: DriverEntity) => void,
    onError?: (err: Error) => void,
  ): () => void {
    try {
      return this.repository.listenById(id, onUpdate, onError);
    } catch (error: any) {
      console.error(`Erro ao escutar motorista ${id} em tempo real:`, error);
      throw new Error(
        error.message || 'Erro ao escutar motorista em tempo real',
      );
    }
  }
}
