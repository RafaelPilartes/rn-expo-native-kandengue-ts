import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandMMKVStorage } from './zustandMMKVStorage';
import { PERMISSIONS_STORAGE_ID } from '../constants';

export type PermissionsState = {
  permissionsSeen: boolean;
};

type PermissionsStore = PermissionsState & {
  // Actions
  setPermissionsSeen: (seen: boolean) => void;
};

// Valores iniciais
const INITIAL_SETTINGS: PermissionsState = {
  permissionsSeen: false,
};

export const usePermissionsStore = create<PermissionsStore>()(
  persist(
    set => ({
      // Valores iniciais
      ...INITIAL_SETTINGS,

      // Setters
      setPermissionsSeen: seen => set({ permissionsSeen: seen }),
    }),
    {
      name: PERMISSIONS_STORAGE_ID,
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);
