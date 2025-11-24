// AppRouter.tsx - VERSÃO COM AUTENTICAÇÃO REAL
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthRouter from './navigation/AuthRouter';
import TabRouter from './Tab/TabRouter';
import LoadingScreen from '@/screens/Loading';
import { Alert } from 'react-native';

import { useAuthViewModel } from '@/viewModels/AuthViewModel';
import { useAuthStore } from '@/storage/store/useAuthStore';
import { UserInterface } from '@/interfaces/IUser';

const Stack = createNativeStackNavigator();

export default function AppRouter() {
  const [isInitializing, setIsInitializing] = useState(true);

  // ViewModel (React Query + use cases)
  const {
    currentUser, // UserInterface | null (comes from authUseCase.getCurrentUser)
    isAuthenticated: isFirebaseAuthenticated, // boolean (derived in VM)
    isLoading: authLoading, // loading state for the query
    refetchUser, // function to re-fetch current user from Firebase
    checkEmailVerification, // mutation object (use mutateAsync)
    logout: logoutMutation, // mutation object (use mutateAsync)
  } = useAuthViewModel();

  // Zustand store (persisted via MMKV)
  const {
    user: zustandUser,
    currentMissionId,
    setUser: setZustandUser,
    logout: zustandLogout,
  } = useAuthStore();

  // =========================================================
  // FUNÇÃO AUXILIAR: Validations for app access — adapta conforme os campos reais do UserInterface
  // =========================================================
  const isUserValidForApp = (user: UserInterface | null): boolean => {
    if (!user) return false;

    // Ajusta estes campos de acordo com a tua entidade UserInterface
    const hasEmail = !!(user.email && user.email.length);
    const hasName = !!(user.name && user.name.length);
    const isActive = user.status ? user.status !== 'banned' : true;
    const isVerified = user.email_verified ?? true;

    if (!hasEmail || !hasName) {
      console.log('❌ Dados do user incompletos');
      return false;
    }

    if (!isVerified) {
      console.log('❌ Email não verificado');
      return false;
    }

    if (!isActive) {
      console.log('❌ User com status não ativo');
      return false;
    }

    return true;
  };

  // =========================================================
  // SINCRONIZAR ESTADOS: Sincroniza Zustand com estado retornado pelo ViewModel (Firebase)
  // =========================================================
  const syncAuthState = async () => {
    try {
      console.log('🔄 Sincronizando estado de autenticação...');

      // Se Firebase tem um user autenticado
      if (currentUser && isFirebaseAuthenticated) {
        // Verifica email via mutation exposta (se existir)
        let isEmailVerified = false;

        try {
          // checkEmailVerification é um objeto de mutation (useMutation)
          // se não existir no VM, este call falhará e assumimos false temporariamente
          if (checkEmailVerification?.mutateAsync) {
            isEmailVerified = await checkEmailVerification.mutateAsync();
          }
        } catch (e) {
          console.warn(
            '⚠️ Falha ao verificar email (assumindo estado atual).',
            e,
          );
        }

        const isValid = isUserValidForApp(currentUser) && !!isEmailVerified;

        if (isValid) {
          // sincroniza Zustand apenas se necessário
          if (!zustandUser || zustandUser.id !== currentUser.id) {
            console.log('✅ Sincronizando Zustand com user válido');
            setZustandUser(currentUser);
          }
        } else {
          console.log('❌ User inválido para uso no app — forçando logout');
          await handleInvalidUser(currentUser);
        }
      } else {
        // Não há user no Firebase — garantir que Zustand esteja limpo
        if (zustandUser) {
          console.log('🔄 Firebase não possui user; limpando Zustand');
          zustandLogout();
        }
      }
    } catch (error) {
      console.error('❌ Erro ao sincronizar autenticação:', error);
    }
  };

  // =========================================================
  // FUNÇÃO: Cleanup & notificações quando user inválido
  // =========================================================
  const handleInvalidUser = async (user: UserInterface | null) => {
    try {
      // Executa logout no servidor (Firebase) se a mutation existir
      try {
        if (logoutMutation?.mutateAsync) {
          await logoutMutation.mutateAsync();
        }
      } catch (e) {
        console.warn('⚠️ Falha no logout via mutation (continuando).', e);
      }

      // Limpa Zustand local
      zustandLogout();

      // Mostra alerta adequado
      if (user) {
        const isVerified = user.email_verified ?? false;
        const status = user.status ?? 'active';

        if (!isVerified) {
          Alert.alert(
            'Email não verificado',
            'Por favor, verifique seu email antes de acessar o aplicativo.',
            [{ text: 'OK' }],
          );
        } else if (status !== 'active') {
          Alert.alert(
            'Conta inativa',
            'Sua conta está inativa. Entre em contato com o suporte.',
            [{ text: 'OK' }],
          );
        }
      } else {
        // fallback genérico
        Alert.alert(
          'Acesso negado',
          'Conta inválida. Faça login novamente ou contate o suporte.',
        );
      }
    } catch (error) {
      console.error('Erro ao tratar usuário inválido:', error);
    }
  };

  // =========================================================
  // INICIALIZAÇÃO DO APP: Inicialização: refetch + sincronização
  // =========================================================
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      console.log('🚀 Inicializando AppRouter...');

      try {
        // 1) Recarrega user atual do Firebase (via React Query in VM)
        if (refetchUser) {
          await refetchUser();
        }

        // 2) Sincroniza Zustand com o resultado
        await syncAuthState();

        // Pequeno delay para smooth UX (opcional)
        await new Promise(res => setTimeout(res, 650));
      } catch (err) {
        console.error('❌ Erro durante inicialização:', err);
      } finally {
        if (mounted) setIsInitializing(false);
      }
    };

    initialize();
    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // DEFINIR ACESSO: compute final access flag
  // =========================================================
  const zustandIsAuthed = !!zustandUser;

  const canAccessApp =
    !!currentUser && // firebase has user
    isFirebaseAuthenticated && // vm indicates authenticated
    zustandIsAuthed && // persisted local store has user
    currentUser?.id === zustandUser?.id && // same user
    isUserValidForApp(currentUser);

  console.log('🎯 Estado atual AppRouter:');
  console.log('  Firebase:', isFirebaseAuthenticated);
  console.log('  Zustand:', zustandIsAuthed);
  console.log('  User:', currentUser?.email || 'Nulo');
  console.log('  Acesso permitido:', canAccessApp);

  // =========================================================
  // LOADING: Enquanto inicializa ou enquanto o VM está carregando: mostra loading
  // =========================================================
  if (isInitializing || authLoading) {
    return <LoadingScreen />;
  }

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!canAccessApp ? (
        <Stack.Screen name="Auth" component={AuthRouter} />
      ) : (
        <Stack.Screen name="Main" component={TabRouter} />
      )}
    </Stack.Navigator>
  );
}
