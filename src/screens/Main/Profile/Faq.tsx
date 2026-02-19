// src/screens/FaqScreen.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native'
import {
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  User,
  CreditCard,
  Package,
  Shield,
  Smartphone,
  Car,
  AlertTriangle
} from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { PageHeader } from '@/components/PageHeader'
import ROUTES from '@/constants/routes'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function FaqScreen() {
  const navigation = useNavigation<any>()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState('all')

  const toggleItem = (id: string) => {
    const newItems = new Set(expandedItems)
    if (newItems.has(id)) {
      newItems.delete(id)
    } else {
      newItems.add(id)
    }
    setExpandedItems(newItems)
  }

  const isItemExpanded = (id: string) => expandedItems.has(id)

  const categories = [
    { id: 'all', label: 'Todas', icon: HelpCircle },
    { id: 'account', label: 'Conta', icon: User },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'rides', label: 'Corridas', icon: Car },
    { id: 'delivery', label: 'Entregas', icon: Package },
    { id: 'safety', label: 'Segurança', icon: Shield },
    { id: 'technical', label: 'Técnico', icon: Smartphone }
  ]

  const faqItems = [
    {
      id: 'faq-1',
      category: 'account',
      question: 'Como criar minha conta no Kandengue Atrevido?',
      answer: `Para criar sua conta:

1. Baixe o app na App Store ou Google Play
2. Clique em "Registrar"
3. Preencha: nome completo, email, telefone e senha
4. Confirme seu email através do link enviado
5. Complete seu perfil com foto e documentos (para motoristas)

✅ Conta verificada em até 24 horas para motoristas.`
    },
    {
      id: 'faq-2',
      category: 'account',
      question: 'Esqueci minha senha. Como recuperar?',
      answer: `1. Na tela de login, clique em "Esqueci a senha"
2. Digite o email cadastrado
3. Verifique sua caixa de entrada (e spam)
4. Clique no link de redefinição
5. Crie uma nova senha segura

🔒 Links expiram em 1 hora por segurança.`
    },
    {
      id: 'faq-3',
      category: 'payments',
      question: 'Quais formas de pagamento são aceitas?',
      answer: `• 💰 Dinheiro (para corridas)
• 💳 Cartão de crédito/débito (Visa, Mastercard)
• 📱 Carteira digital do app
• 🏦 Transferência bancária

💡 Para entregas: apenas pagamento digital.
⚠️ Não aceitamos cheques.`
    },
    {
      id: 'faq-4',
      category: 'payments',
      question: 'Como funciona a carteira digital?',
      answer: `A carteira digital permite:

• Carregar saldo com cartão ou transferência
• Pagar corridas sem usar dinheiro físico
• Receber pagamentos (para motoristas)
• Visualizar extrato completo
• Solicitar saques (para motoristas)

💰 Saldo mínimo para saque: 1.000 Kz
⏰ Saques processados em 24-48 horas`
    },
    {
      id: 'faq-5',
      category: 'rides',
      question: 'Como solicitar uma corrida?',
      answer: `1. Abra o app e permita acesso à localização
2. Digite o destino ou escolha no mapa
3. Selecione o tipo de veículo (Carro, Moto)
4. Confirme o local de embarque
5. Toque em "Solicitar Corrida"
6. Aguarde um motorista aceitar

📍 Dica: Adicione pontos de referência para facilitar.`
    },
    {
      id: 'faq-6',
      category: 'rides',
      question: 'Posso cancelar uma corrida? Há multa?',
      answer: `Sim, mas com restrições:

✅ Cancelamento gratuito nos primeiros 2 minutos
⚠️ Após 2 minutos: taxa de 200 Kz
🚫 Cancelamentos frequentes podem limitar sua conta

💡 Motivos aceitos para cancelamento sem taxa:
• Motorista não chegou em 10 minutos
• Informações incorretas do motorista
• Emergências comprovadas`
    },
    {
      id: 'faq-7',
      category: 'delivery',
      question: 'Quais itens posso enviar por entrega?',
      answer: `✅ PERMITIDOS:
• Documentos
• Roupas
• Eletrônicos pequenos
• Comida
• Medicamentos (com receita)
• Presentes

🚫 PROIBIDOS:
• Armas
• Drogas ilícitas
• Animais vivos
• Itens perecíveis sem embalagem adequada
• Objetos ilegais

📦 Tamanho máximo: 50x50x50 cm`
    },
    {
      id: 'faq-8',
      category: 'delivery',
      question: 'Como rastrear minha entrega?',
      answer: `1. Acesse "Minhas Entregas" no app
2. Selecione a entrega desejada
3. Veja o mapa em tempo real
4. Acompanhe a rota do entregador
5. Receba notificações de status

📍 Atualizações em tempo real
👤 Foto do entregador disponível
📱 Chat direto com o entregador`
    },
    {
      id: 'faq-9',
      category: 'safety',
      question: 'Os motoristas são verificados?',
      answer: `SIM! Todos os motoristas passam por:

• ✅ Verificação de antecedentes criminais
• ✅ Validação de documentos (carta de condução)
• ✅ Vistoria do veículo
• ✅ Treinamento de segurança
• ✅ Avaliação contínua pelos usuários

🛡️ Sistema de avaliação bilateral
🚨 Botão de emergência no app
📞 Suporte 24/7 para emergências`
    },
    {
      id: 'faq-10',
      category: 'safety',
      question: 'O que fazer em caso de problema durante a corrida?',
      answer: `EMERGÊNCIAS:
1. Use o botão de emergência no app
2. Ligue para 113 (polícia)
3. Contate nosso suporte: +244 923 456 789

PROBLEMAS:
1. Reporte no app imediatamente
2. Tire fotos como evidência
3. Entre em contato com o suporte
4. Avalie o serviço posteriormente

📞 Suporte disponível 24/7
⚡ Resposta em até 15 minutos`
    },
    {
      id: 'faq-11',
      category: 'technical',
      question: 'O app está travando. O que fazer?',
      answer: `Solução de problemas:

1. 🔄 Feche e reabra o app
2. 📱 Reinicie seu smartphone
3. 🌐 Verifique sua conexão internet
4. 📲 Atualize para a versão mais recente
5. 🗑️ Limpe cache do app

Se persistir:
• Desinstale e reinstale o app
• Contate nosso suporte técnico
• Verifique se seu dispositivo é compatível

📞 Suporte técnico: +244 923 456 789`
    },
    {
      id: 'faq-12',
      category: 'technical',
      question: 'Consigo usar o app em múltiplos dispositivos?',
      answer: `• ✅ SIM, mas com limitações de segurança
• 🔒 Apenas um dispositivo ativo por vez
• 📧 Receberá alerta de novo login
• 🚫 Não compartilhe sua conta
• 👤 Perfis separados para passageiro/motorista

💡 Dica: Use o mesmo número para múltiplos perfis
⚠️ Atividade suspeita pode bloquear a conta temporariamente`
    },
    {
      id: 'faq-13',
      category: 'rides',
      question: 'Como funciona o sistema de avaliação?',
      answer: `Avaliação bilateral (1-5 estrelas):

👤 Passageiro avalia:
• Condução segura
• Pontualidade
• Limpeza do veículo
• Educação do motorista

🚗 Motorista avalia:
• Pontualidade no embarque
• Educação e respeito
• Pagamento correto

📊 Média mínima: 4.0 para continuar na plataforma
💬 Comentários são moderados`
    },
    {
      id: 'faq-14',
      category: 'payments',
      question: 'Como solicitar reembolso?',
      answer: `Condições para reembolso:

1. Corrida cancelada após cobrança
2. Problema técnico duplicando pagamento
3. Serviço não prestado conforme combinado

Processo:
1. Acesse "Ajuda" no app
2. Selecione "Solicitar Reembolso"
3. Descreva o problema detalhadamente
4. Anexe comprovantes se necessário

⏰ Prazo de análise: 3-7 dias úteis
💳 Reembolsos voltam para o método original`
    }
  ]

  const filteredFaqs = faqItems.filter(item => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.icon || HelpCircle
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <PageHeader title="Perguntas Frequentes" canGoBack={true} />

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Search Bar */}
        <View className="px-6 pt-6">
          <View className="bg-white rounded-2xl flex-row items-center px-4 py-3">
            <Search size={20} color="#6B7280" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar nas perguntas frequentes..."
              className="flex-1 ml-3 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 mt-4"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {categories.map(category => {
            const IconComponent = category.icon
            const isActive = activeCategory === category.id

            return (
              <TouchableOpacity
                key={category.id}
                className={`mr-3 px-4 py-2 rounded-full flex-row items-center ${
                  isActive
                    ? 'bg-primary-200'
                    : 'bg-white border border-gray-200'
                }`}
                onPress={() => setActiveCategory(category.id)}
              >
                <IconComponent
                  size={16}
                  color={isActive ? 'white' : '#6B7280'}
                />
                <Text
                  className={`ml-2 font-medium ${
                    isActive ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Results Count */}
        <View className="px-6 mt-4 mb-2">
          <Text className="text-gray-600 text-sm">
            {filteredFaqs.length}{' '}
            {filteredFaqs.length === 1 ? 'resultado' : 'resultados'} encontrados
          </Text>
        </View>

        {/* FAQ Items */}
        <View className="px-6 mt-2">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map(faq => {
              const IconComponent = getCategoryIcon(faq.category)
              const isExpanded = isItemExpanded(faq.id)

              return (
                <View key={faq.id} className="mb-3">
                  <TouchableOpacity
                    className="bg-white rounded-2xl  p-5"
                    onPress={() => toggleItem(faq.id)}
                  >
                    <View className="flex-row justify-between items-start">
                      <View className="flex-row items-start flex-1">
                        <IconComponent size={18} color="#E0212D" />
                        <Text className="text-lg font-semibold text-gray-900 flex-1 ml-1">
                          {faq.question}
                        </Text>
                      </View>
                      {isExpanded ? (
                        <ChevronUp size={20} color="#6B7280" />
                      ) : (
                        <ChevronDown size={20} color="#6B7280" />
                      )}
                    </View>

                    {isExpanded && (
                      <Text className="text-gray-700 leading-6 mt-4 whitespace-pre-line">
                        {faq.answer}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )
            })
          ) : (
            <View className="bg-white rounded-2xl  p-8 items-center">
              <HelpCircle size={48} color="#9CA3AF" />
              <Text className="text-gray-500 text-lg font-medium mt-3 text-center">
                Nenhum resultado encontrado
              </Text>
              <Text className="text-gray-400 text-center mt-1">
                Tente outros termos de busca ou categories
              </Text>
            </View>
          )}
        </View>

        {/* Contact Support */}
        <View className="px-6 mt-6">
          <View className="bg-primary-50 rounded-2xl p-5">
            <Text className="text-primary-800 font-semibold text-center mb-2">
              Não encontrou o que procurava?
            </Text>
            <Text className="text-primary-700 text-sm text-center">
              Nossa equipe de suporte está disponível 24/7 para ajudar
            </Text>

            <TouchableOpacity
              className="bg-primary-200 rounded-xl py-3 mt-3"
              onPress={() => navigation.navigate(ROUTES.ProfileStack.HELP)}
            >
              <Text className="text-white font-semibold text-center">
                Falar com Suporte
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
