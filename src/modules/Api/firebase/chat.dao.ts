// modules/Api/firebase/chat.dao.ts
import { ChatEntity } from '@/core/entities/Chat'
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  getDoc,
  onSnapshot
} from '@react-native-firebase/firestore'
import { db } from '@/config/firebase.config'
import { firebaseCollections } from '@/constants/firebaseCollections'
import { generateId } from '@/helpers/generateId'

export class FirebaseChatDAO {
  private chatsRef = collection(db, firebaseCollections.chats.root)

  async createOrGetChatForRide(
    rideId: string,
    driver: { id: string; name: string; avatar?: string },
    passenger: { id: string; name: string; avatar?: string }
  ): Promise<ChatEntity> {
    const driverId = driver.id
    const userId = passenger.id

    const chatDocRef = doc(this.chatsRef, rideId)
    const docSnap = await getDoc(chatDocRef)

    if (docSnap.exists()) {
      return new ChatEntity({
        id: docSnap.id,
        ...(docSnap.data() as ChatEntity)
      })
    }

    // Create new chat using rideId as chatId
    const chatData: ChatEntity = {
      id: rideId,
      rideId,
      participantIds: [driverId, userId],
      driver,
      passenger,
      unreadCount: { [driverId]: 0, [userId]: 0 },
      created_at: new Date(),
      updated_at: new Date()
    }

    await setDoc(chatDocRef, chatData)

    return new ChatEntity(chatData)
  }

  async getChatById(chatId: string): Promise<ChatEntity | null> {
    const docSnap = await getDoc(doc(this.chatsRef, chatId))
    if (!docSnap.exists()) return null
    return new ChatEntity({ id: docSnap.id, ...(docSnap.data() as ChatEntity) })
  }

  async markAsRead(chatId: string, userId: string): Promise<void> {
    const chatDoc = doc(this.chatsRef, chatId)
    await updateDoc(chatDoc, {
      [`unreadCount.${userId}`]: 0
    })
  }

  listenChat(chatId: string, onUpdate: (chat: ChatEntity) => void): () => void {
    const ref = doc(this.chatsRef, chatId)
    return onSnapshot(ref, snap => {
      if (snap.exists()) {
        const data = snap.data() as ChatEntity
        onUpdate(new ChatEntity({ id: snap.id, ...data }))
      }
    })
  }
}
