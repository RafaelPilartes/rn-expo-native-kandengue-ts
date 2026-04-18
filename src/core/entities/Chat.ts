// core/entities/Chat.ts
import type { IChat } from '@/interfaces/IChat';

export class ChatEntity implements IChat {
  id?: string;
  rideId?: string;
  participantIds: string[];
  
  passenger?: { id: string; name: string; avatar?: string };
  driver?: { id: string; name: string; avatar?: string };
  
  lastMessage?: string;
  lastMessageTimestamp?: Date;
  unreadCount?: Record<string, number>;
  created_at?: Date;
  updated_at?: Date;

  constructor(params: IChat) {
    this.id = params.id;
    this.rideId = params.rideId;
    this.participantIds = params.participantIds;
    this.passenger = params.passenger;
    this.driver = params.driver;
    this.lastMessage = params.lastMessage;
    this.lastMessageTimestamp = params.lastMessageTimestamp;
    this.unreadCount = params.unreadCount;
    this.created_at = params.created_at;
    this.updated_at = params.updated_at;
  }
}
