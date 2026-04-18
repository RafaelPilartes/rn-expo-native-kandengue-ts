// core/entities/Message.ts
import type { IMessage } from '@/interfaces/IChat';

export class MessageEntity implements IMessage {
  id?: string;
  chatId: string;
  senderId: string;
  text: string;
  read: boolean;
  created_at?: Date;

  constructor(params: IMessage) {
    this.id = params.id;
    this.chatId = params.chatId;
    this.senderId = params.senderId;
    this.text = params.text;
    this.read = params.read;
    this.created_at = params.created_at;
  }
}
