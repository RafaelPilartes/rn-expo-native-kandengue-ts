import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthUseCase } from '@/domain/usecases/authUseCase';
import type {
  LoginCredentials,
  RegisterData,
} from '@/core/interfaces/IAuthRepository';
import { useAuthStore } from '@/storage/store/useAuthStore';
import { UserInterface } from '@/interfaces/IUser';

const authUseCase = new AuthUseCase();

export function useAuthViewModel() {
  const queryClient = useQueryClient();
  const { user, setUser, logout: clearAuth } = useAuthStore();

  // 🧠 QUERY: usuario atual sincronizado com Firebase
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useQuery<UserInterface | null>({
    queryKey: ['currentUser'],
    queryFn: () => authUseCase.getCurrentUser(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    initialData: user, // inicializa com Zustand
  });

  // 🧠 Computed flag — evita query extra só pra isso
  const isAuthenticated = !!currentUser;

  // MUTATION: Registrar usuario
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authUseCase.register(data),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(['currentUser'], user);
    },
    onError: (error: Error) => {
      console.error('Erro no registro:', error);
    },
  });

  // MUTATION: Login
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authUseCase.login(credentials),
    onSuccess: ({ user }) => {
      // VERIFICAR: Se usuário é válido antes de sincronizar
      const isValid = user.email_verified && user.status === 'active';

      if (isValid) {
        setUser(user);
        queryClient.setQueryData(['currentUser'], user);
      }
    },
    onError: (error: Error) => {
      console.error('Erro no login:', error);
      // LIMPAR: cache em caso de erro
      setUser(null);
      queryClient.clear(); // limpa cache de autenticação
    },
  });

  // MUTATION: Logout
  const logoutMutation = useMutation({
    mutationFn: () => authUseCase.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear(); // limpa cache de autenticação
    },
    onError: (error: Error) => {
      console.error('Erro no logout:', error);
    },
  });

  // MUTATION: Recuperação de senha
  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authUseCase.forgotPassword(email),
    onError: (error: Error) => console.error('Erro na recuperação:', error),
  });

  // MUTATION: Enviar verificação de email
  const sendEmailVerificationMutation = useMutation({
    mutationFn: () => authUseCase.sendEmailVerification(),
    onSuccess: () => console.log('Email de verificação enviado'),
    onError: (error: Error) =>
      console.error('Erro ao enviar verificação:', error),
  });

  // MUTATION: Verificar email
  const checkEmailVerificationMutation = useMutation({
    mutationFn: () => authUseCase.checkEmailVerification(),
    onSuccess: async isVerified => {
      if (isVerified) await refetchUser();
    },
    onError: (error: Error) => console.error('Erro ao verificar email:', error),
  });

  // MUTATION: Recarregar usuario
  const reloadUserMutation = useMutation({
    mutationFn: () => authUseCase.reloadUser(),
    onSuccess: () => refetchUser(),
    onError: (error: Error) => console.error('Erro ao recarregar:', error),
  });

  return {
    // Estado
    currentUser,
    isAuthenticated,
    isLoading: isLoadingUser,
    userError,

    // Mutations
    register: registerMutation,
    login: loginMutation,
    logout: logoutMutation,
    forgotPassword: forgotPasswordMutation,

    // Mutations para email
    sendEmailVerification: sendEmailVerificationMutation,
    checkEmailVerification: checkEmailVerificationMutation,
    reloadUser: reloadUserMutation,

    // Utilitários
    refetchUser,
  };
}
