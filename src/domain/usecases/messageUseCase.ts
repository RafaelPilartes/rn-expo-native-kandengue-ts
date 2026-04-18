// domain/usecases/messageUseCase.ts
import { FirebaseMessageDAO } from '@/modules/Api/firebase/message.dao'
import type { MessageEntity } from '@/core/entities/Message'

export class MessageUseCase {
  private messageDAO: FirebaseMessageDAO

  constructor() {
    this.messageDAO = new FirebaseMessageDAO()
  }

  async sendMessage(chatId: string, senderId: string, receiverId: string, text: string): Promise<MessageEntity> {
    return await this.messageDAO.sendMessage(chatId, senderId, receiverId, text)
  }

  listenMessages(chatId: string, onUpdate: (messages: MessageEntity[]) => void): () => void {
    return this.messageDAO.listenMessages(chatId, onUpdate)
  }
}
