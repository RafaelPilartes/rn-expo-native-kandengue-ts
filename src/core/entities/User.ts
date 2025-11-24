// core/entities/User.ts
import type { UserInterface } from '@/interfaces/IUser';
import type { UserAvailability, UserStatus } from '@/types/enum';
import { LocationType } from '@/types/geoLocation';

export class UserEntity implements UserInterface {
  id?: string;
  entity_code?: string;
  photo?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  status: UserStatus;
  availability: UserAvailability;
  email_verified?: boolean;
  phone_verified?: boolean;
  created_at?: Date;
  updated_at?: Date;
  last_login?: Date;
  firebase_uid?: string;
  location?: LocationType;
  last_location_update?: Date;

  constructor(params: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    password?: string;
    entity_code?: string;
    photo?: string;
    status: UserStatus;
    availability: UserAvailability;
    email_verified?: boolean;
    phone_verified?: boolean;
    created_at?: Date;
    updated_at?: Date;
    last_login?: Date;
    firebase_uid?: string;
    location?: LocationType;
    last_location_update?: Date;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.phone = params.phone;
    this.password = params.password;
    this.entity_code = params.entity_code;
    this.photo = params.photo;
    this.status = params.status;
    this.availability = params.availability || 'available';
    this.email_verified = params.email_verified || false;
    this.phone_verified = params.phone_verified || false;
    this.created_at = params.created_at;
    this.updated_at = params.updated_at;
    this.last_login = params.last_login;
    this.firebase_uid = params.firebase_uid;
    this.location = params.location;
    this.last_location_update = params.last_location_update;
  }

  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.name?.trim()) errors.push('Nome é obrigatório');
    if (!this.email?.trim()) errors.push('Email é obrigatório');
    if (!this.phone?.trim()) errors.push('Telefone é obrigatório');
    if (!this.validateEmail(this.email)) errors.push('Email inválido');
    if (this.password && this.password.length < 6)
      errors.push('Senha deve ter pelo menos 6 caracteres');

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
