// modules/Api/firebase/auth.dao.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  reload,
} from '@react-native-firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  collection,
  getDocs,
} from '@react-native-firebase/firestore';
import { db, auth } from '@/config/firebase.config';
import type {
  IAuthRepository,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '@/core/interfaces/IAuthRepository';
import { UserEntity } from '@/core/entities/User';
import { firebaseCollections } from '@/constants/firebaseCollections';
import type { UserStatus } from '@/types/enum';
import { UserInterface } from '@/interfaces/IUser';
import { convertFirestoreTimestamp } from '@/utils/formatDate';
import { generateId } from '@/helpers/generateId';
import { mapFirebaseError } from '@/helpers/mapFirebaseError';

export class FirebaseAuthDAO implements IAuthRepository {
  private auth = auth;
  private usersRef = firebaseCollections.users.root;

  // REGISTRO - Usando ID próprio em vez do UID
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Iniciando registro para:', userData.email);

      // 1. Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password,
      );

      const firebaseUser = userCredential.user;

      // GERAR: ID próprio (não usar UID do Firebase)
      const userId: string = generateId('user');

      // 2. Criar perfil do usuário no Firestore com ID próprio
      const userEntity = new UserEntity({
        ...userData,
        id: userId,
        status: 'active' as UserStatus,
        availability: 'available',
        email_verified: false,
        phone_verified: false,
        created_at: new Date(),
        firebase_uid: firebaseUser.uid,
      });

      // Validar dados
      const validation = userEntity.validate();
      if (!validation.isValid) {
        await firebaseUser.delete();
        throw new Error(validation.errors.join(', '));
      }

      // SALVAR: No Firestore usando o ID próprio
      await setDoc(
        doc(db, this.usersRef, userId),
        this.sanitizeUserForFirestore(userEntity),
      );

      // 3. Atualizar perfil no Firebase Auth
      await updateProfile(firebaseUser, {
        displayName: userData.name,
      });

      // 4. Enviar verificação por email
      await this.sendEmailVerification();

      console.log('✅ Email de verificação enviado para:', userData.email);
      console.log('✅ User criado com ID:', userId);

      return {
        user: userEntity,
        token: await firebaseUser.getIdToken(),
      };
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw new Error(mapFirebaseError(error));
    }
  }

  // LOGIN - Buscar por email em vez de UID
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password,
      );

      const firebaseUser = userCredential.user;

      // BUSCAR: User pelo email (não pelo UID)
      const usersQuery = query(
        collection(db, this.usersRef),
        where('email', '==', firebaseUser.email?.toLowerCase()),
      );
      const userSnapshot = await getDocs(usersQuery);

      if (userSnapshot.empty) {
        throw new Error('Perfil do usuario não encontrado');
      }

      // Pegar o primeiro documento (deve ser único por email)
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data() as UserInterface;

      // Criar entidade
      const userEntity = new UserEntity({
        ...userData,
        id: userDoc.id, // USAR ID do documento (nosso ID próprio)
        name: userData.name || '',
        email: userData.email || firebaseUser.email || '',
        phone: userData.phone || '',
        status: userData.status || 'active',
        entity_code: userData.entity_code,
        photo: userData.photo,
        email_verified: userData.email_verified || false,
        phone_verified: userData.phone_verified || false,
        firebase_uid: userData.firebase_uid || firebaseUser.uid, // MANTER referência
        created_at:
          convertFirestoreTimestamp(userData.created_at) || new Date(),
        updated_at: convertFirestoreTimestamp(userData.updated_at),
        last_login: new Date(),
      });

      // ATUALIZAR: Usando nosso ID próprio
      await updateDoc(doc(db, this.usersRef, userDoc.id), {
        last_login: new Date(),
        updated_at: new Date(),
        firebase_uid: firebaseUser.uid, // GARANTIR que tem a referência
      });

      return {
        user: userEntity,
        token: await firebaseUser.getIdToken(),
      };
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(mapFirebaseError(error));
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('Logout realizado com sucesso');
    } catch (error: any) {
      console.error('Erro no logout:', error);
      throw new Error('Erro ao sair');
    }
  }

  // GET CURRENT DRIVER - Buscar por Firebase UID ou email
  async getCurrentUser(): Promise<UserEntity | null> {
    try {
      const firebaseUser = this.auth.currentUser;

      if (!firebaseUser) {
        return null;
      }

      let userDoc: any = null;

      // TENTAR 1: Buscar por firebase_uid
      const uidQuery = query(
        collection(db, this.usersRef),
        where('firebase_uid', '==', firebaseUser.uid),
      );
      const uidSnapshot = await getDocs(uidQuery);

      if (!uidSnapshot.empty) {
        userDoc = uidSnapshot.docs[0];
      } else {
        // TENTAR 2: Buscar por email (fallback)
        const emailQuery = query(
          collection(db, this.usersRef),
          where('email', '==', firebaseUser.email?.toLowerCase()),
        );
        const emailSnapshot = await getDocs(emailQuery);

        if (!emailSnapshot.empty) {
          userDoc = emailSnapshot.docs[0];

          // ATUALIZAR: Adicionar firebase_uid se não tiver
          if (!userDoc.data().firebase_uid) {
            await updateDoc(doc(db, this.usersRef, userDoc.id), {
              firebase_uid: firebaseUser.uid,
              updated_at: new Date(),
            });
          }
        }
      }

      if (!userDoc) {
        console.warn('Nenhum user encontrado para o usuário atual');
        return null;
      }

      const userData = userDoc.data() as UserInterface;

      return new UserEntity({
        id: userDoc.id, // USAR ID do documento
        name: userData.name || firebaseUser.displayName || '',
        email: userData.email || firebaseUser.email || '',
        phone: userData.phone || '',
        status: userData.status || 'active',
        availability: userData.availability || 'available',
        entity_code: userData.entity_code,
        photo: userData.photo,
        email_verified:
          userData.email_verified || firebaseUser.emailVerified || false,
        phone_verified: userData.phone_verified || false,
        firebase_uid: userData.firebase_uid || firebaseUser.uid,
        created_at:
          convertFirestoreTimestamp(userData.created_at) || new Date(),
        updated_at: convertFirestoreTimestamp(userData.updated_at),
        last_login: convertFirestoreTimestamp(userData.last_login),
      });
    } catch (error) {
      console.error('Erro ao buscar usuario atual:', error);
      return null;
    }
  }
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = this.auth.currentUser;
      return !!user;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Email de recuperação enviado para:', email);
    } catch (error: any) {
      console.error('Erro ao enviar email de recuperação:', error);
      throw new Error(mapFirebaseError(error));
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    throw new Error('Método não implementado - use o link do email');
  }

  // Enviar verificação por email
  async sendEmailVerification(): Promise<void> {
    try {
      const currentUser = this.auth.currentUser;

      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      if (currentUser.emailVerified) {
        console.log('Email já verificado');
        return;
      }

      console.log('Enviando verificação por email para:', currentUser.email);
      await sendEmailVerification(currentUser);

      console.log('✅ Email de verificação enviado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao enviar verificação por email:', error);
      throw new Error(mapFirebaseError(error));
    }
  }

  // Verificar se email foi confirmado
  async checkEmailVerification(): Promise<boolean> {
    try {
      const currentUser = this.auth.currentUser;

      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      await this.reloadUser();
      return currentUser.emailVerified;
    } catch (error: any) {
      console.error('Erro ao verificar email:', error);
      return false;
    }
  }

  // Recarregar dados do usuário
  async reloadUser(): Promise<void> {
    try {
      const currentUser = this.auth.currentUser;

      if (!currentUser) {
        return;
      }

      await reload(currentUser);
      console.log('✅ Dados do usuário recarregados');
    } catch (error: any) {
      console.error('❌ Erro ao recarregar usuário:', error);
      throw new Error('Erro ao atualizar dados do usuário');
    }
  }

  // UTILITÁRIO: Buscar user por ID próprio
  async getUserById(userId: string): Promise<UserEntity | null> {
    try {
      const userDoc = await getDoc(doc(db, this.usersRef, userId));

      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data() as UserInterface;

      return new UserEntity({
        id: userDoc.id,
        ...userData,
        created_at: convertFirestoreTimestamp(userData.created_at),
        updated_at: convertFirestoreTimestamp(userData.updated_at),
        last_login: convertFirestoreTimestamp(userData.last_login),
      });
    } catch (error) {
      console.error('Erro ao buscar user por ID:', error);
      return null;
    }
  }

  private sanitizeUserForFirestore(user: UserEntity): any {
    const sanitized: any = { ...user };
    delete sanitized.password;
    return Object.fromEntries(
      Object.entries(sanitized).filter(([_, v]) => v !== undefined),
    );
  }
}
