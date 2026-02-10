// src/screens/Help.tsx
import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native'
import {
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  CreditCard,
  MapPin,
  Shield
} from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { PageHeader } from '@/components/PageHeader'
import ROUTES from '@/constants/routes'
import {
  EMAIL_SUPPORT,
  VOICE_NUMBER,
  WHATSAPP_NUMBER
} from '@/constants/config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAlert } from '@/context/AlertContext'

export default function HelpScreen() {
  const navigation = useNavigation<any>()
  const { showAlert } = useAlert()
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  const handleCall = () => {
    Linking.openURL('tel:+244923456789').catch(() =>
      showAlert('Erro', 'Não foi possível iniciar a chamada.', 'error')
    )
  }

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/244923456789').catch(() =>
      showAlert('Erro', 'Não foi possível abrir o WhatsApp.', 'error')
    )
  }

  const handleEmail = () => {
    Linking.openURL(
      'mailto:support@kandengueatrevido.com?subject=Suporte - Kandengue Atrevido'
    ).catch(() => showAlert('Erro', 'Não foi possível abrir o email.', 'error'))
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
            'Baixe o app, clique em "Registrar" e preencha seus dados pessoais. Você receberá um email de confirmação para ativar sua conta.'
        },
        {
          id: 'account-2',
          question: 'Como recuperar minha senha?',
          answer:
            'Na tela de login, clique em "Esqueci a senha", insira seu email e siga as instruções enviadas.'
        },
        {
          id: 'account-3',
          question: 'Como atualizar meus dados?',
          answer:
            'Acesse "Perfil" → "Editar Perfil". Você pode atualizar nome, telefone e foto.'
        }
      ]
    },
    {
      id: 'payments',
      title: 'Pagamentos',
      icon: CreditCard,
      questions: [
        {
          id: 'payments-1',
          question: 'Quais formas de pagamento aceitam?',
          answer:
            'Aceitamos dinheiro, transferência bancária e carteira digital do app.'
        },
        {
          id: 'payments-2',
          question: 'Como funciona a carteira digital?',
          answer:
            'Você pode carregar saldo na sua carteira para pagar corridas sem usar dinheiro físico.'
        },
        {
          id: 'payments-3',
          question: 'Como solicitar reembolso?',
          answer:
            'Entre em contato com o suporte dentro de 24 horas explicando o motivo do reembolso.'
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
          question: 'Como solicitar uma corrida?',
          answer:
            'Abra o app, defina origem e destino, escolha o tipo de veículo e confirme.'
        },
        {
          id: 'rides-2',
          question: 'Posso cancelar uma corrida?',
          answer:
            'Sim, mas cancelamentos frequentes podem afetar sua avaliação.'
        },
        {
          id: 'rides-3',
          question: 'Como funciona o sistema de entregas?',
          answer:
            'Selecione "Entrega", defina os pontos de recolha e entrega, e descreva o pacote.'
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
          question: 'Os motoristas são verificados?',
          answer:
            'Sim, todos passam por verificação de documentos e treinamento.'
        },
        {
          id: 'safety-2',
          question: 'Como reportar um problema?',
          answer:
            'Use a função "Ajuda" no app ou entre em contato diretamente com nosso suporte.'
        }
      ]
    }
  ]

  const supportHours = [
    { day: 'Segunda - Sexta', hours: '7:00 - 22:00' },
    { day: 'Sábado', hours: '8:00 - 20:00' },
    { day: 'Domingo', hours: '9:00 - 18:00' }
  ]

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <PageHeader title="Central de Ajuda" canGoBack={true} />

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Hero Section */}
        <View className="bg-primary-200 px-6 py-8">
          <View className="items-center">
            <HelpCircle size={50} color="white" />
            <Text className="text-2xl font-bold text-white text-center mt-3">
              Como podemos ajudar?
            </Text>
            <Text className="text-white/90 text-center mt-2">
              Encontre respostas rápidas ou fale com nossa equipe
            </Text>
          </View>
        </View>

        {/* FAQ por Categorias */}
        <View className="px-6 mt-6">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </Text>

          {faqCategories.map(category => {
            const IconComponent = category.icon
            return (
              <View key={category.id} className="mb-4">
                <View className="flex-row items-center mb-3">
                  <IconComponent size={20} color="#E0212D" />
                  <Text className="text-lg font-semibold text-gray-900 ml-2">
                    {category.title}
                  </Text>
                </View>

                {category.questions.map(faq => (
                  <TouchableOpacity
                    key={faq.id}
                    className="bg-white rounded-xl shadow-sm p-4 mb-2"
                    onPress={() => toggleFAQ(faq.id)}
                  >
                    <View className="flex-row justify-between items-start">
                      <Text className="font-semibold text-gray-800 flex-1 mr-2">
                        {faq.question}
                      </Text>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp size={20} color="#6B7280" />
                      ) : (
                        <ChevronDown size={20} color="#6B7280" />
                      )}
                    </View>

                    {expandedFAQ === faq.id && (
                      <Text className="text-gray-600 mt-3 leading-5">
                        {faq.answer}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )
          })}
        </View>

        {/* Horário de Atendimento */}
        <View className="px-6 mt-4">
          <View className="bg-blue-50 rounded-2xl p-5">
            <View className="flex-row items-center mb-3">
              <Clock size={20} color="#1D4ED8" />
              <Text className="text-blue-800 font-semibold ml-2">
                Horário de Atendimento
              </Text>
            </View>

            {supportHours.map((schedule, index) => (
              <View key={index} className="flex-row justify-between py-1">
                <Text className="text-blue-700">{schedule.day}</Text>
                <Text className="text-blue-700 font-medium">
                  {schedule.hours}
                </Text>
              </View>
            ))}

            <Text className="text-blue-600 text-sm mt-3">
              • Atendimento preferencial por WhatsApp{'\n'}• Tempo médio de
              resposta: 15 minutos
            </Text>
          </View>
        </View>

        {/* Canais de Contato */}
        <View className="px-6 mt-6">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Fale Conosco
          </Text>

          <View className="space-y-3">
            <TouchableOpacity
              onPress={handleWhatsApp}
              className="flex-row items-center bg-white rounded-2xl shadow p-5"
            >
              <View className="w-12 h-12 bg-green-100 rounded-xl items-center justify-center">
                <MessageCircle size={24} color="#059669" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-semibold text-gray-900">WhatsApp</Text>
                <Text className="text-gray-600 text-sm">
                  Resposta rápida - Recomendado
                </Text>
              </View>
              <Text className="text-green-600 font-semibold">
                {WHATSAPP_NUMBER}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCall}
              className="flex-row items-center bg-white rounded-2xl shadow p-5"
            >
              <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center">
                <Phone size={24} color="#1D4ED8" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-semibold text-gray-900">Telefone</Text>
                <Text className="text-gray-600 text-sm">
                  Atendimento por voz
                </Text>
              </View>
              <Text className="text-blue-600 font-semibold">
                {VOICE_NUMBER}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEmail}
              className="flex-row items-center bg-white rounded-2xl shadow p-5"
            >
              <View className="w-12 h-12 bg-red-100 rounded-xl items-center justify-center">
                <Mail size={24} color="#DC2626" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-semibold text-gray-900">Email</Text>
                <Text className="text-gray-600 text-sm">
                  Para assuntos detalhados
                </Text>
              </View>
              <Text className="text-red-600 font-semibold text-sm">
                {EMAIL_SUPPORT}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ações Rápidas */}
        <View className="px-6 mt-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Ações Rápidas
          </Text>

          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ROUTES.ProfileStack.COMPLAINTS)
              }
              className="w-1/2 px-1 mb-2"
            >
              <View className="bg-white rounded-xl shadow p-4 items-center">
                <Shield size={24} color="#E0212D" />
                <Text className="text-gray-800 font-medium text-center mt-2">
                  Fazer Reclamação
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.ProfileStack.ABOUT)}
              className="w-1/2 px-1 mb-2"
            >
              <View className="bg-white rounded-xl shadow p-4 items-center">
                <HelpCircle size={24} color="#E0212D" />
                <Text className="text-gray-800 font-medium text-center mt-2">
                  Sobre o App
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
