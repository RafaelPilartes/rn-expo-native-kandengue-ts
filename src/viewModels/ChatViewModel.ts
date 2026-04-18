// viewModels/ChatViewModel.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChatUseCase } from '@/domain/usecases/chatUseCase'
import { MessageUseCase } from '@/domain/usecases/messageUseCase'
import { ChatEntity } from '@/core/entities/Chat'
import { MessageEntity } from '@/core/entities/Message'
import { useEffect, useRef, useState } from 'react'

const chatUseCase = new ChatUseCase()
const messageUseCase = new MessageUseCase()

export function useChatViewModel() {
  const queryClient = useQueryClient()
  const [messages, setMessages] = useState<MessageEntity[]>([])
  const [currentChat, setCurrentChat] = useState<ChatEntity | null>(null)
  const [isMessagesLoaded, setIsMessagesLoaded] = useState(false)

  const getOrCreateChat = useMutation({
    mutationFn: ({
      rideId,
      driver,
      passenger
    }: {
      rideId: string
      driver: { id: string; name: string; avatar?: string }
      passenger: { id: string; name: string; avatar?: string }
    }) => chatUseCase.getOrCreateChatForRide(rideId, driver, passenger),
    onSuccess: chat => {
      setCurrentChat(chat)
    }
  })

  const sendMessage = useMutation({
    mutationFn: ({
      chatId,
      senderId,
      receiverId,
      text
    }: {
      chatId: string
      senderId: string
      receiverId: string
      text: string
    }) => messageUseCase.sendMessage(chatId, senderId, receiverId, text)
  })

  const markAsRead = useMutation({
    mutationFn: ({ chatId, userId }: { chatId: string; userId: string }) =>
      chatUseCase.markAsRead(chatId, userId)
  })

  // Listener for Realtime Messages
  const messagesListenRef = useRef<(() => void) | null>(null)
  const listenChatMessages = (chatId: string) => {
    if (messagesListenRef.current) messagesListenRef.current()

    messagesListenRef.current = messageUseCase.listenMessages(
      chatId,
      newMessages => {
        setMessages(newMessages)
        setIsMessagesLoaded(true)
      }
    )
  }

  // Listener for Chat Meta Update (Unread count, etc)
  const chatListenRef = useRef<(() => void) | null>(null)
  const listenChatSession = (chatId: string) => {
    if (chatListenRef.current) chatListenRef.current()

    chatListenRef.current = chatUseCase.listenChat(chatId, chat => {
      setCurrentChat(chat)
    })
  }

  useEffect(() => {
    return () => {
      if (messagesListenRef.current) messagesListenRef.current()
      if (chatListenRef.current) chatListenRef.current()
    }
  }, [])

  return {
    messages,
    currentChat,
    isInitializing: getOrCreateChat.isPending,
    isMessagesLoaded,
    isSending: sendMessage.isPending,

    getOrCreateChat,
    sendMessage,
    markAsRead,

    listenChatMessages,
    listenChatSession
  }
}
