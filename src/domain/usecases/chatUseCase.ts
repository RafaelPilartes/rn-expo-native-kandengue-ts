// domain/usecases/chatUseCase.ts
import { FirebaseChatDAO } from '@/modules/Api/firebase/chat.dao'
import type { ChatEntity } from '@/core/entities/Chat'

export class ChatUseCase {
  private chatDAO: FirebaseChatDAO

  constructor() {
    this.chatDAO = new FirebaseChatDAO()
  }

  async getOrCreateChatForRide(
    rideId: string, 
    driver: { id: string; name: string; avatar?: string }, 
    passenger: { id: string; name: string; avatar?: string }
  ): Promise<ChatEntity> {
    return await this.chatDAO.createOrGetChatForRide(rideId, driver, passenger)
  }

  async getChatById(chatId: string): Promise<ChatEntity | null> {
    return await this.chatDAO.getChatById(chatId)
  }

  async markAsRead(chatId: string, userId: string): Promise<void> {
    return await this.chatDAO.markAsRead(chatId, userId)
  }

  listenChat(chatId: string, onUpdate: (chat: ChatEntity) => void): () => void {
    return this.chatDAO.listenChat(chatId, onUpdate)
  }
}
