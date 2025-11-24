export interface IStorage {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  clearAll(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}
