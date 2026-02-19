// src/screens/Help.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native'
import {
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  MapPin,
  Shield
} from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import {
  EMAIL_SUPPORT,
  VOICE_NUMBER,
  WHATSAPP_NUMBER
} from '@/constants/config'
import { PageHeader } from '@/components/PageHeader'

export default function HelpScreen() {
  const navigation = useNavigation<any>()
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  const handleCall = () => {
    Linking.openURL(`tel:${VOICE_NUMBER}`).catch(() =>
      Alert.alert('Erro', 'Não foi possível iniciar a chamada.')
    )
  }

  const handleWhatsApp = () => {
    // Ideally format number to international format without spaces/dashes
    Linking.openURL(
      `https://wa.me/244${WHATSAPP_NUMBER.replace(/\s/g, '')}`
    ).catch(() => Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.'))
  }

  const handleEmail = () => {
    Linking.openURL(
      `mailto:${EMAIL_SUPPORT}?subject=Suporte - Kandengue Atrevido`
    ).catch(() => Alert.alert('Erro', 'Não foi possível abrir o email.'))
  }

  const faqCategories = [
    {
      id: 'account',
      title: 'Conta e Perfil',
      icon: User,
      questions: [
        {
          id: 'account-1',
          question: 'Como criar uma conta?',
          answer:
            'Baixe o app, clique em "Registrar" e preencha seus dados. Um código de verificação será enviado para o seu número.'
        },
        {
          id: 'account-2',
          question: 'Esqueci minha senha',
          answer:
            'Na tela de login, use a opção "Esqueci a Senha" para redefinir suas credenciais via SMS ou email.'
        }
      ]
    },
    {
      id: 'rides',
      title: 'Corridas e Entregas',
      icon: MapPin,
      questions: [
        {
          id: 'rides-1',
          question: 'Como pedir uma corrida?',
          answer:
            'Na tela inicial, insira o destino, escolha o tipo de veículo e confirme. O motorista mais próximo aceitará seu pedido.'
        },
        {
          id: 'rides-3',
          question: 'Como funcionam as entregas?',
          answer:
            'Selecione a opção "Entrega", preencha os detalhes do pacote e do destinatário. Um estafeta irá recolher e entregar para você.'
        }
      ]
    },
    {
      id: 'safety',
      title: 'Segurança',
      icon: Shield,
      questions: [
        {
          id: 'safety-1',
          question: 'Botão de Pânico',
          answer:
            'Em caso de emergência durante a corrida, use o botão de pânico para alertar seus contatos de confiança e as autoridades.'
        }
      ]
    }
  ]

  const supportHours = [
    { day: 'Segunda - Sexta', hours: '08:00 - 17:30' },
    { day: 'Sábado', hours: '09:00 - 14:30' },
    { day: 'Domingo', hours: 'Fechado' }
  ]

  return (
    <View className="flex-1 bg-gray-50 m-safe">
      <PageHeader title="Central de Ajuda" canGoBack={true} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Hero (Visual only) */}
        <View className="px-5 mt-6 mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Como podemos ajudar?
          </Text>
        </View>

        {/* Contact Channels */}
        <View className="px-5 mb-8">
          <Text className="text-xs font-bold text-gray-400 uppercase mb-3 ml-1 tracking-wider">
            Canais de Atendimento
          </Text>

          <View className="gap-3">
            <TouchableOpacity
              onPress={handleWhatsApp}
              className="flex-row items-center bg-white rounded-xl border border-gray-100 p-4 active:bg-gray-50"
            >
              <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center border border-green-100">
                <MessageCircle size={20} color="#10B981" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-semibold text-gray-900">WhatsApp</Text>
                <Text className="text-gray-500 text-xs">Resposta rápida</Text>
              </View>
              <Text className="text-green-600 font-bold text-sm">Online</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCall}
              className="flex-row items-center bg-white rounded-xl border border-gray-100 p-4 active:bg-gray-50"
            >
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center border border-blue-100">
                <Phone size={20} color="#3B82F6" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-semibold text-gray-900">Ligar agora</Text>
                <Text className="text-gray-500 text-xs">{VOICE_NUMBER}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEmail}
              className="flex-row items-center bg-white rounded-xl border border-gray-100 p-4 active:bg-gray-50"
            >
              <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
                <Mail size={20} color="#6B7280" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-semibold text-gray-900">Email</Text>
                <Text className="text-gray-500 text-xs truncate">
                  {EMAIL_SUPPORT}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Hours */}
        <View className="px-5 mb-8">
          <View className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
            <View className="flex-row items-center mb-3">
              <Clock size={16} color="#3B82F6" />
              <Text className="text-blue-900 font-bold ml-2 text-sm">
                Horário de Atendimento
              </Text>
            </View>
            {supportHours.map((schedule, index) => (
              <View key={index} className="flex-row justify-between py-1">
                <Text className="text-gray-600 text-xs font-medium">
                  {schedule.day}
                </Text>
                <Text className="text-gray-900 text-xs font-bold">
                  {schedule.hours}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View className="px-5">
          <Text className="text-xs font-bold text-gray-400 uppercase mb-3 ml-1 tracking-wider">
            Perguntas Frequentes
          </Text>

          {faqCategories.map(category => (
            <View key={category.id} className="mb-6">
              <View className="flex-row items-center mb-2 ml-1">
                <category.icon size={16} color="#4B5563" />
                <Text className="text-sm font-bold text-gray-700 ml-2">
                  {category.title}
                </Text>
              </View>

              <View className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {category.questions.map((faq, index) => (
                  <TouchableOpacity
                    key={faq.id}
                    className={`p-4 ${index !== category.questions.length - 1 ? 'border-b border-gray-50' : ''}`}
                    onPress={() => toggleFAQ(faq.id)}
                  >
                    <View className="flex-row justify-between items-start">
                      <Text className="text-sm font-medium text-gray-900 flex-1 mr-4 leading-snug">
                        {faq.question}
                      </Text>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp size={18} color="#9CA3AF" />
                      ) : (
                        <ChevronDown size={18} color="#9CA3AF" />
                      )}
                    </View>
                    {expandedFAQ === faq.id && (
                      <Text className="text-gray-500 text-xs mt-2 leading-relaxed">
                        {faq.answer}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
