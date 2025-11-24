import { createMMKV } from 'react-native-mmkv'
import { IStorage } from '../interfaces/IStorage'
import { ZUSTAND_STORAGE_ID } from '../constants'

// Instância usada pelo zustand
export const plainMMKV = createMMKV({
  id: ZUSTAND_STORAGE_ID
})

export class MMKVStorage implements IStorage {
  private instance: ReturnType<typeof createMMKV>

  constructor(id: string, encryptionKey?: string) {
    this.instance = createMMKV({
      id,
      encryptionKey
    })
  }

  async getItem<T>(key: string): Promise<T | null> {
    const value = this.instance.getString(key)
    if (value == null) return null

    try {
      return JSON.parse(value) as T
    } catch {
      return value as unknown as T
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    if (typeof value === 'string') {
      this.instance.set(key, value)
    } else {
      this.instance.set(key, JSON.stringify(value))
    }
  }

  async removeItem(key: string): Promise<void> {
    this.instance.remove(key)
  }

  async clearAll(): Promise<void> {
    this.instance.clearAll()
  }

  async getAllKeys(): Promise<string[]> {
    return this.instance.getAllKeys()
  }
}
