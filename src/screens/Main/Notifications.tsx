// src/screens/Notifications.tsx
import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import { Info, Gift, Car, Bike, CheckCheck } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { PageHeader } from '@/components/PageHeader'

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  isRead: boolean
  type: 'ride' | 'promo' | 'info' | 'system'
}

export default function NotificationsScreen() {
  const navigation = useNavigation<any>()

  // Mock data - substituir com dados reais
  const notifications: NotificationItem[] = [
    {
      id: 'n1',
      title: 'Nova corrida concluída',
      message:
        'Sua viagem de carro foi finalizada com sucesso. Ganhos: AOA 2.500',
      time: 'Há 5 min',
      isRead: false,
      type: 'ride'
    },
    {
      id: 'n2',
      title: 'Promoção disponível',
      message: 'Ganhe 20% de bónus nas próximas 5 entregas hoje!',
      time: 'Há 1 hora',
      isRead: false,
      type: 'promo'
    },
    {
      id: 'n3',
      title: 'Documento aprovado',
      message: 'Sua carta de condução foi verificada e aprovada.',
      time: 'Há 3 horas',
      isRead: true,
      type: 'system'
    },
    {
      id: 'n4',
      title: 'Atualização disponível',
      message: 'Nova versão do app com melhorias de desempenho.',
      time: 'Ontem',
      isRead: true,
      type: 'info'
    },
    {
      id: 'n5',
      title: 'Meta atingida! 🎉',
      message: 'Você completou 50 corridas esta semana. Parabéns!',
      time: '2 dias atrás',
      isRead: true,
      type: 'system'
    }
  ]

  const getIconByType = (type: string) => {
    switch (type) {
      case 'ride':
        return { icon: Car, color: '#2563EB', bg: 'bg-blue-50' }
      case 'promo':
        return { icon: Gift, color: '#22C55E', bg: 'bg-green-50' }
      case 'info':
        return { icon: Info, color: '#F59E0B', bg: 'bg-amber-50' }
      case 'system':
        return { icon: CheckCheck, color: '#8B5CF6', bg: 'bg-purple-50' }
      default:
        return { icon: Info, color: '#6B7280', bg: 'bg-gray-100' }
    }
  }

  const renderItem = React.useCallback(
    ({ item }: { item: NotificationItem }) => {
      const { icon: Icon, color, bg } = getIconByType(item.type)

      return (
        <TouchableOpacity
          style={
            !item.isRead ? [styles.shadow, styles.unreadBorder] : styles.shadow
          }
          className="bg-white rounded-2xl p-4 flex-row gap-3"
          activeOpacity={0.7}
        >
          {/* Icon Circle */}
          <View
            className={`w-11 h-11 rounded-full items-center justify-center ${bg}`}
          >
            <Icon size={20} color={color} />
          </View>

          {/* Content */}
          <View className="flex-1">
            <View className="flex-row justify-between items-start mb-1">
              <Text
                className="text-base font-semibold text-gray-900 flex-1 mr-2"
                numberOfLines={1}
              >
                {item.title}
              </Text>
              {!item.isRead && (
                <View className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
              )}
            </View>
            <Text
              className="text-sm text-gray-600 leading-5 mb-1.5"
              numberOfLines={2}
            >
              {item.message}
            </Text>
            <Text className="text-xs text-gray-400 font-medium">
              {item.time}
            </Text>
          </View>
        </TouchableOpacity>
      )
    },
    []
  )

  const renderSeparator = React.useCallback(() => <View className="h-3" />, [])

  const ListHeaderComponent = React.useCallback(
    () => (
      <View className="flex-row justify-between items-center mb-5">
        <TouchableOpacity activeOpacity={0.7}>
          <Text className="text-sm font-semibold text-primary-200">
            Marcar todas como lidas
          </Text>
        </TouchableOpacity>
      </View>
    ),
    []
  )

  const ListEmptyComponent = React.useCallback(
    () => (
      <View className="items-center justify-center py-20">
        <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-4">
          <Info size={48} color="#9CA3AF" />
        </View>
        <Text className="text-lg font-bold text-gray-900 mb-2">
          Nenhuma notificação
        </Text>
        <Text className="text-sm text-gray-500 text-center">
          Você está em dia! Novas notificações aparecerão aqui.
        </Text>
      </View>
    ),
    []
  )

  return (
    <View className="flex-1 bg-gray-50 py-safe">
      <PageHeader title="Notificações" canGoBack={true} />

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#2424244b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  unreadBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E'
  }
})
