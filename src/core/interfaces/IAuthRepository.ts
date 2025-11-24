// core/interfaces/IAuthRepository.ts
import { UserInterface } from '@/interfaces/IUser';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  user: UserInterface; // MUDAR de user para user
  token?: string;
}

export interface IAuthRepository {
  // Autenticação
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(userData: RegisterData): Promise<AuthResponse>;
  logout(): Promise<void>;

  // Estado da autenticação
  getCurrentUser(): Promise<UserInterface | null>;
  isAuthenticated(): Promise<boolean>;

  // Recuperação de senha
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;

  // Verificação por email
  sendEmailVerification(): Promise<void>;
  checkEmailVerification(): Promise<boolean>;
  reloadUser(): Promise<void>; // MUDAR de reloadUser para reloadUser

  getUserById(userId: string): Promise<UserInterface | null>;
}
