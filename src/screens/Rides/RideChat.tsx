import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ArrowLeft, Send } from 'lucide-react-native'
import { HomeStackParamList } from '@/types/navigation'
import { useChatViewModel } from '@/viewModels/ChatViewModel'
import { SafeAreaView } from 'react-native-safe-area-context'

type RideChatRouteProp = RouteProp<HomeStackParamList, 'RideChatScreen'>

export default function RideChatScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>()
  const route = useRoute<RideChatRouteProp>()
  const { rideId, driver, passenger } = route.params

  const currentUserId = passenger.id
  const otherUserId = driver.id

  const {
    messages,
    currentChat,
    isMessagesLoaded,
    isInitializing,
    isSending,
    getOrCreateChat,
    sendMessage,
    markAsRead,
    listenChatMessages,
    listenChatSession
  } = useChatViewModel()

  const [text, setText] = useState('')

  useEffect(() => {
    // 1. Inicia ouvintes imediatamente sem bloquear a UI (chatId == rideId)
    listenChatMessages(rideId)
    listenChatSession(rideId)

    // 2. Garante a criação do Doc silenciosamente e marca como lido
    getOrCreateChat.mutateAsync({ rideId, driver, passenger }).then(() => {
      markAsRead.mutate({ chatId: rideId, userId: currentUserId })
    })
  }, [])

  const handleSend = () => {
    if (!text.trim()) return
    sendMessage.mutate({
      chatId: rideId,
      senderId: currentUserId,
      receiverId: otherUserId,
      text: text.trim()
    })
    setText('')
  }

  const renderBubble = ({ item }: { item: any }) => {
    const isMe = item.senderId === currentUserId

    return (
      <View
        style={{
          alignSelf: isMe ? 'flex-end' : 'flex-start',
          maxWidth: '85%'
        }}
        className={`flex-row rounded-2xl px-4 py-3 gap-3 mb-2 ${
          isMe ? 'bg-green-600 rounded-tr-sm' : 'bg-gray-100 rounded-tl-sm'
        }`}
      >
        <Text
          className={`text-base font-semibold leading-5 ${isMe ? 'text-white' : 'text-gray-800'}`}
        >
          {item.text}
        </Text>
        <Text
          className={`text-xs font-thin mt-2 text-right ${isMe ? 'text-white' : 'text-gray-400'}`}
        >
          {item.created_at?.seconds
            ? new Date(item.created_at.seconds * 1000).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            : ''}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View className="flex-row items-center py-4 px-4 bg-white border-b border-gray-100 shadow-sm relative z-10">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-50 active:bg-gray-100"
          >
            <ArrowLeft size={20} color="#111827" />
          </TouchableOpacity>
          <View className="ml-4 flex-1">
            <Text className="font-bold text-gray-900 text-lg">
              Chat da Corrida
            </Text>
            <Text className="text-xs text-green-600 font-medium">
              Motorista & Passageiro
            </Text>
          </View>
        </View>

        {/* Body */}
        <View className="flex-1 bg-[#FAFAFA] px-4">
          {!isMessagesLoaded ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#16A34A" />
            </View>
          ) : (
            <FlatList
              data={messages}
              inverted
              keyExtractor={item => item.id || Math.random().toString()}
              renderItem={renderBubble}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 16 }}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center py-10">
                  <Text className="text-gray-400 text-center text-sm">
                    Nenhuma mensagem ainda.{'\n'}Inicie a conversa!
                  </Text>
                </View>
              }
            />
          )}
        </View>

        {/* Input Footer */}
        <View className="px-4 py-3 bg-white border-t border-gray-100 flex-row items-center">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Escreva uma mensagem..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
            className="flex-1 bg-gray-50 rounded-3xl min-h-[46px] max-h-32 px-5 py-3 text-base text-gray-900"
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!text.trim() || isSending}
            className={`w-12 h-12 ml-3 rounded-full items-center justify-center ${
              text.trim() ? 'bg-green-600 active:bg-green-700' : 'bg-gray-200'
            }`}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Send
                size={20}
                color={text.trim() ? '#ffffff' : '#9CA3AF'}
                className="ml-1"
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
