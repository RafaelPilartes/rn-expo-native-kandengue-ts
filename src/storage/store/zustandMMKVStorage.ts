// src/storage/store/zustandMMKVStorage.ts
import { plainMMKV } from '../adapters/MMKVStorage'

export const zustandMMKVStorage = {
  getItem: (key: string): string | null => {
    return plainMMKV.getString(key) ?? null
  },
  setItem: (key: string, value: string): void => {
    plainMMKV.set(key, value)
  },
  removeItem: (key: string): void => {
    plainMMKV.remove(key)
  },
  clearAll: (): void => {
    plainMMKV.clearAll()
  },
  getAllKeys: (): string[] => {
    return plainMMKV.getAllKeys()
  }
}
