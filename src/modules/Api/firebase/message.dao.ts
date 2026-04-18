// modules/Api/firebase/message.dao.ts
import { MessageEntity } from '@/core/entities/Message'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  doc,
  updateDoc,
  increment,
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore'
import { db } from '@/config/firebase.config'
import { firebaseCollections } from '@/constants/firebaseCollections'
import { generateId } from '@/helpers/generateId'

export class FirebaseMessageDAO {
  
  async sendMessage(chatId: string, senderId: string, receiverId: string, text: string): Promise<MessageEntity> {
    const messageId = generateId('msg')
    const messageData: MessageEntity = {
      id: messageId,
      chatId,
      senderId,
      text,
      read: false,
      created_at: new Date()
    }

    // 1) Set message
    const messagesRef = collection(db, firebaseCollections.chats.messages(chatId))
    await setDoc(doc(messagesRef, messageId), messageData)

    // 2) Update chat lastMessage & increment unreadCount for receiver
    const chatDocRef = doc(db, firebaseCollections.chats.root, chatId)
    await updateDoc(chatDocRef, {
      lastMessage: text,
      lastMessageTimestamp: new Date(),
      updated_at: new Date(),
      [`unreadCount.${receiverId}`]: increment(1)
    })

    return new MessageEntity(messageData)
  }

  listenMessages(
    chatId: string,
    onUpdate: (messages: MessageEntity[]) => void
  ): () => void {
    const messagesRef = collection(db, firebaseCollections.chats.messages(chatId))
    // We order by created_at desc so Inverted FlatList can consume it efficiently (newest bottom)
    const q = query(messagesRef, orderBy('created_at', 'desc'))

    return onSnapshot(q, (snapshot) => {
      const messages: MessageEntity[] = []
      snapshot.forEach((docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
        const data = docSnap.data() as MessageEntity
        messages.push(new MessageEntity({ id: docSnap.id, ...data }))
      })
      onUpdate(messages)
    })
  }
}
