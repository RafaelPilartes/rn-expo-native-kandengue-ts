import AsyncStorage from '@react-native-async-storage/async-storage';
import { IStorage } from '../interfaces/IStorage';

export class AsyncStorageAdapter implements IStorage {
  async getItem<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    if (typeof value === 'string') {
      await AsyncStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  async clearAll(): Promise<void> {
    await AsyncStorage.clear();
  }

  async getAllKeys(): Promise<string[]> {
    return Array.from(await AsyncStorage.getAllKeys());
  }
}
