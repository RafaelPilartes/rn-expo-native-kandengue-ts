// src/domain/usecases/usersUseCase.ts;
import { userRepository } from '@/modules/Api';
import { UserEntity } from '@/core/entities/User';
import type { ListResponseType } from '@/interfaces/IApiResponse';
import { LocationType } from '@/types/geoLocation';

export class UserUseCase {
  private repository = userRepository;

  async getAll(
    limit?: number,
    offset?: number,
    searchTerm?: string,
    filters?: Partial<UserEntity>,
  ): Promise<ListResponseType<UserEntity[]>> {
    try {
      return await this.repository.getAll(limit, offset, searchTerm, filters);
    } catch (error: any) {
      console.error('Erro ao buscar motoristas:', error);
      throw new Error(error.message || 'Erro ao buscar motoristas');
    }
  }

  async getById(id: string): Promise<UserEntity | null> {
    try {
      return await this.repository.getById(id);
    } catch (error: any) {
      console.error(`Erro ao buscar motorista ${id}:`, error);
      throw new Error(error.message || 'Erro ao buscar motorista');
    }
  }

  // get one by custom field
  async getOneByField(field: string, value: any): Promise<UserEntity | null> {
    try {
      return await this.repository.getOneByField(field, value);
    } catch (error: any) {
      console.error(`Erro ao buscar user por ${field}-${value}:`, error);
      throw new Error(error.message || 'Erro ao buscar user');
    }
  }

  // get by custom field
  async getAllByField(
    field: string,
    value: any,
    limit?: number,
    offset?: number,
  ): Promise<ListResponseType<UserEntity[]>> {
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

  async getByEmail(email: string): Promise<UserEntity | null> {
    try {
      return await this.repository.getByEmail(email);
    } catch (error: any) {
      console.error(`Erro ao buscar motorista ${email}:`, error);
      throw new Error(error.message || 'Erro ao buscar motorista');
    }
  }

  async create(user: Omit<UserEntity, 'id'>): Promise<UserEntity> {
    if (!user.name || !user.email) {
      throw new Error('Nome e email são obrigatórios');
    }

    try {
      return await this.repository.create(user);
    } catch (error: any) {
      console.error('Erro ao criar motorista:', error);
      throw new Error(error.message || 'Erro ao criar motorista');
    }
  }

  async update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
    try {
      return await this.repository.update(id, user);
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
    availability: UserEntity['availability'],
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
  listenUserRealtime(
    id: string,
    onUpdate: (user: UserEntity) => void,
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
