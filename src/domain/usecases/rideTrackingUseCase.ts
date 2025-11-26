// src/domain/usecases/rideTrackingsUseCase.ts;
import { rideTrackingRepository } from '@/modules/Api'
import { RideTrackingEntity } from '@/core/entities/RideTracking'
import type { ListResponseType } from '@/interfaces/IApiResponse'

export class RideTrackingUseCase {
  private repository = rideTrackingRepository

  async getAll(
    limit?: number,
    offset?: number,
    searchTerm?: string,
    filters?: Partial<RideTrackingEntity>
  ): Promise<ListResponseType<RideTrackingEntity[]>> {
    try {
      return await this.repository.getAll(limit, offset, searchTerm, filters)
    } catch (error: any) {
      console.error('Erro ao buscar trajetorias de viagens:', error)
      throw new Error(error.message || 'Erro ao buscar trajetoria de viagem')
    }
  }

  async getById(id: string): Promise<RideTrackingEntity | null> {
    try {
      return await this.repository.getById(id)
    } catch (error: any) {
      console.error(`Erro ao buscar trajetoria de viagem ${id}:`, error)
      throw new Error(error.message || 'Erro ao buscar trajetorias de viagens')
    }
  }

  // get one by custom field
  async getOneByField(
    field: string,
    value: any
  ): Promise<RideTrackingEntity | null> {
    try {
      return await this.repository.getOneByField(field, value)
    } catch (error: any) {
      console.error(`Erro ao buscar rideTracking por ${field}-${value}:`, error)
      throw new Error(error.message || 'Erro ao buscar rideTracking')
    }
  }

  // get by custom field
  async getAllByField(
    field: string,
    value: any,
    limit?: number,
    offset?: number
  ): Promise<ListResponseType<RideTrackingEntity[]>> {
    try {
      const { data, pagination } = await this.repository.getAllByField(
        field,
        value,
        limit,
        offset
      )

      return { data, pagination }
    } catch (error: any) {
      console.error(
        `Erro ao buscar trajetoria de viagem pelo campo ${field} com valor ${value}:`,
        error
      )
      throw new Error(error.message || 'Erro ao buscar trajetoria de viagem')
    }
  }

  async create(
    rideTracking: Omit<RideTrackingEntity, 'id'>
  ): Promise<RideTrackingEntity> {
    try {
      return await this.repository.create(rideTracking)
    } catch (error: any) {
      console.error('Erro ao criar trajetoria de viagem:', error)
      throw new Error(error.message || 'Erro ao criar trajetoria de viagem')
    }
  }

  async update(
    id: string,
    rideTracking: Partial<RideTrackingEntity>
  ): Promise<RideTrackingEntity> {
    try {
      return await this.repository.update(id, rideTracking)
    } catch (error: any) {
      console.error(`Erro ao atualizar trajetoria de viagem ${id}:`, error)
      throw new Error(error.message || 'Erro ao atualizar trajetoria de viagem')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.repository.delete(id)
    } catch (error: any) {
      console.error(`Erro ao deletar trajetoria de viagem ${id}:`, error)
      throw new Error(error.message || 'Erro ao deletar trajetoria de viagem')
    }
  }

  listenRideRealtime(
    id: string,
    onUpdate: (rideTracking: RideTrackingEntity) => void,
    onError?: (err: Error) => void
  ): () => void {
    try {
      return this.repository.listenById(id, onUpdate, onError)
    } catch (error: any) {
      console.error(`Erro ao escutar corrida ${id} em tempo real:`, error)
      throw new Error(error.message || 'Erro ao escutar corrida em tempo real')
    }
  }

  listenByField(
    field: keyof RideTrackingEntity,
    value: string,
    onUpdate: (rideTracking: RideTrackingEntity) => void,
    onError?: (err: Error) => void
  ) {
    try {
      return this.repository.listenByField(field, value, onUpdate, onError)
    } catch (error: any) {
      console.error(`Erro ao escutar corrida pelo campo ${field}:`, error)
      throw new Error(error.message || 'Erro ao escutar corrida pelo campo')
    }
  }

  listenAllByField(
    field: keyof RideTrackingEntity,
    value: any,
    onUpdate: (rideTrackings: RideTrackingEntity[]) => void,
    onError?: (err: Error) => void,
    options: {
      limit?: number
      orderBy?: keyof RideTrackingEntity
      orderDirection?: 'asc' | 'desc'
    } = {}
  ) {
    try {
      return this.repository.listenAllByField(
        field,
        value,
        onUpdate,
        onError,
        options
      )
    } catch (error: any) {
      console.error(`Erro ao escutar corridas pelo campo ${field}:`, error)
      throw new Error(error.message || 'Erro ao escutar corridas pelo campo')
    }
  }

  listenAll(
    onUpdate: (rideTrackings: RideTrackingEntity[]) => void,
    onError?: (err: Error) => void,
    options: {
      filters?: Partial<RideTrackingEntity>
      limit?: number
      orderBy?: keyof RideTrackingEntity
      orderDirection?: 'asc' | 'desc'
    } = {}
  ) {
    try {
      return this.repository.listenAll(onUpdate, onError, options)
    } catch (error: any) {
      console.error('Erro ao escutar corridas:', error)
      throw new Error(error.message || 'Erro ao escutar corridas')
    }
  }
}
