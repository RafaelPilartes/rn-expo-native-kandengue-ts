// core/interfaces/IRideTrackingRepository.ts
import type { ListResponseType } from '@/interfaces/IApiResponse'
import { RideTrackingEntity } from '../entities/RideTracking'

export interface IRideTrackingRepository {
  getAll(
    limit?: number,
    offset?: number,
    searchTerm?: string,
    filters?: Partial<RideTrackingEntity>
  ): Promise<ListResponseType<RideTrackingEntity[]>>
  getById(id: string): Promise<RideTrackingEntity | null>
  getAllByField(
    field: string,
    value: any,
    limit?: number,
    offset?: number
  ): Promise<ListResponseType<RideTrackingEntity[]>>
  getOneByField(field: string, value: any): Promise<RideTrackingEntity | null>
  create(
    RideTracking: Omit<RideTrackingEntity, 'id'>
  ): Promise<RideTrackingEntity>
  update(
    id: string,
    RideTracking: Partial<RideTrackingEntity>
  ): Promise<RideTrackingEntity>
  delete(id: string): Promise<void>
  listenById(
    id: string,
    onUpdate: (RideTracking: RideTrackingEntity) => void,
    onError?: (err: Error) => void
  ): () => void
  listenByField(
    field: keyof RideTrackingEntity,
    value: string,
    onUpdate: (RideTracking: RideTrackingEntity) => void,
    onError?: (err: Error) => void
  ): () => void

  listenAllByField(
    field: keyof RideTrackingEntity,
    value: any,
    onUpdate: (RideTrackings: RideTrackingEntity[]) => void,
    onError?: (err: Error) => void,
    options?: {
      limit?: number
      orderBy?: keyof RideTrackingEntity
      orderDirection?: 'asc' | 'desc'
    }
  ): () => void

  listenAll(
    onUpdate: (RideTrackings: RideTrackingEntity[]) => void,
    onError?: (err: Error) => void,
    options?: {
      filters?: Partial<RideTrackingEntity>
      limit?: number
      orderBy?: keyof RideTrackingEntity
      orderDirection?: 'asc' | 'desc'
    }
  ): () => void
}
