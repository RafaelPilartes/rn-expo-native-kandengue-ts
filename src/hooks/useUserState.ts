// src/hooks/useUserState.ts
import { useState, useEffect, useCallback } from 'react'
import { UserInterface } from '@/interfaces/IUser'
import { useUsersViewModel } from '@/viewModels/UserViewModel'
import { useAuthStore } from '@/storage/store/useAuthStore'

interface UserStateReturn {
  currentUserData: UserInterface | null
}

export const useUserState = (): UserStateReturn => {
  const { user } = useAuthStore()
  const { listenUserRealtime } = useUsersViewModel()

  const [currentUserData, setCurrentUserData] = useState<UserInterface | null>(
    user
  )

  // Listener em tempo real para o usuário
  useEffect(() => {
    if (!user?.id) return

    console.log('🔹 [useUserState] Iniciando listener de usuário')
    const unsubscribeUser = listenUserRealtime(user.id, setCurrentUserData)

    return unsubscribeUser
  }, [user?.id])

  return {
    currentUserData
  }
}
