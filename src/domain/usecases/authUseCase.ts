// domain/usecases/authUseCase.ts
import { authRepository } from '@/modules/Api';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '@/core/interfaces/IAuthRepository';
import { UserInterface } from '@/interfaces/IUser';

export class AuthUseCase {
  private repository = authRepository;

  // Registrar
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Validações básicas
      if (!userData.name?.trim()) {
        throw new Error('Nome é obrigatório');
      }
      if (!userData.email?.trim()) {
        throw new Error('Email é obrigatório');
      }
      if (!userData.phone?.trim()) {
        throw new Error('Telefone é obrigatório');
      }
      if (!userData.password || userData.password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }

      return await this.repository.register(userData);
    } catch (error: any) {
      console.error('Erro no caso de uso de registro:', error);
      throw new Error(error.message || 'Erro ao criar conta');
    }
  }

  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      if (!credentials.email?.trim()) {
        throw new Error('Email é obrigatório');
      }
      if (!credentials.password) {
        throw new Error('Senha é obrigatória');
      }

      return await this.repository.login(credentials);
    } catch (error: any) {
      console.error('Erro no caso de uso de login:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await this.repository.logout();
    } catch (error: any) {
      console.error('Erro no caso de uso de logout:', error);
      throw new Error(error.message || 'Erro ao sair');
    }
  }

  // Enviar verificação por email
  async sendEmailVerification(): Promise<void> {
    try {
      console.log('UseCase: Enviando verificação por email');
      await this.repository.sendEmailVerification();
    } catch (error: any) {
      console.error('Erro ao enviar verificação:', error);
      throw new Error(error.message || 'Erro ao enviar email de verificação');
    }
  }

  // Verificar status do email
  async checkEmailVerification(): Promise<boolean> {
    try {
      return await this.repository.checkEmailVerification();
    } catch (error: any) {
      console.error('Erro ao verificar email:', error);
      return false;
    }
  }

  // Recarregar usuário
  async reloadUser(): Promise<void> {
    try {
      await this.repository.reloadUser();
    } catch (error: any) {
      console.error('Erro ao recarregar usuário:', error);
      throw new Error('Erro ao atualizar dados');
    }
  }

  // Usuário atual
  async getCurrentUser(): Promise<UserInterface | null> {
    try {
      return await this.repository.getCurrentUser();
    } catch (error: any) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  }

  // Verificar autenticação
  async isAuthenticated(): Promise<boolean> {
    try {
      return await this.repository.isAuthenticated();
    } catch (error: any) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  }

  // Esqueci senha
  async forgotPassword(email: string): Promise<void> {
    try {
      if (!email?.trim()) {
        throw new Error('Email é obrigatório');
      }

      console.log('UseCase: Solicitando recuperação para:', email);
      await this.repository.forgotPassword(email);
    } catch (error: any) {
      console.error('Erro no caso de uso de recuperação:', error);
      throw new Error(error.message || 'Erro ao recuperar senha');
    }
  }
}
