import { AsyncStorageAdapter } from '../adapters/AsyncStorage';
import { StorageManager } from '../storageManager';

export async function migrateFromAsyncToMMKV() {
  const oldStorage = new AsyncStorageAdapter();
  const newStorage = StorageManager.getStorage();

  const keys = await oldStorage.getAllKeys();
  for (const key of keys) {
    const value = await oldStorage.getItem(key);
    if (value !== null) {
      await newStorage.setItem(key, value);
    }
  }
  await oldStorage.clearAll();
}

export async function migrateFromMMKVToAsync() {
  const oldStorage = StorageManager.getStorage();
  const newStorage = new AsyncStorageAdapter();

  const keys = await oldStorage.getAllKeys();
  for (const key of keys) {
    const value = await oldStorage.getItem(key);
    if (value !== null) {
      await newStorage.setItem(key, value);
    }
  }
  await oldStorage.clearAll();
}
