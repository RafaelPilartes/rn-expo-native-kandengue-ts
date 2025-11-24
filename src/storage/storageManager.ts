import { IStorage } from './interfaces/IStorage'
import { MMKVStorage } from './adapters/MMKVStorage'
import { AsyncStorageAdapter } from './adapters/AsyncStorage'
import { STORAGE_ID, STORAGE_TYPE } from './constants'
import { getEncryptionKey } from '@/utils/security/encryption'

// Padrão Factory para criar instância de storage
export class StorageManager {
  private static instance: IStorage

  static getStorage(): IStorage {
    if (!this.instance) {
      throw new Error('StorageManager not initialized')
    }
    return this.instance
  }

  static async initialize(type: STORAGE_TYPE): Promise<void> {
    switch (type) {
      case STORAGE_TYPE.ASYNC:
        this.instance = new AsyncStorageAdapter()
        break
      case STORAGE_TYPE.MMKV:
      default:
        const encryptionKey = await getEncryptionKey()
        // const encryptionKey = 'sua-chave-secreta-aqui';

        this.instance = new MMKVStorage(STORAGE_ID, encryptionKey)
        break
    }
  }
}
