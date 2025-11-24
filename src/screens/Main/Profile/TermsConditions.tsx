// src/screens/TermsConditionsScreen.tsx
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
  FileText,
  Shield,
  CreditCard,
  User,
  MapPin,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  ExternalLink
} from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import PageHeader from '@/components/PageHeader'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TermsConditionsScreen() {
  const navigation = useNavigation<any>()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  )

  const toggleSection = (section: string) => {
    const newSections = new Set(expandedSections)
    if (newSections.has(section)) {
      newSections.delete(section)
    } else {
      newSections.add(section)
    }
    setExpandedSections(newSections)
  }

  const isSectionExpanded = (section: string) => expandedSections.has(section)

  const handleContactLegal = () => {
    Linking.openURL('mailto:legal@kandengueatrevido.com').catch(() =>
      Alert.alert('Erro', 'Não foi possível abrir o email.')
    )
  }

  const termsSections = [
    {
      id: 'acceptance',
      icon: CheckCircle,
      title: '1. Aceitação dos Termos',
      content: `Ao utilizar o aplicativo Kandengue Atrevido, você concorda com estes Termos e Condições. Se não concordar com qualquer parte destes termos, não utilize nossos serviços.

• Idade mínima: 18 anos
• Capacidade legal para celebrar contratos
• Aceitação integral dos termos aqui descritos`
    },
    {
      id: 'services',
      icon: MapPin,
      title: '2. Serviços Prestados',
      content: `O Kandengue Atrevido é uma plataforma que conecta:
      
• Passageiros a motoristas particulares
• Clientes a serviços de entrega
• Usuários a prestadores de serviços logísticos

NÃO SOMOS: prestadores diretos de serviços de transporte, empregadores de motoristas ou responsáveis diretos pelas entregas.`
    },
    {
      id: 'registration',
      icon: User,
      title: '3. Cadastro e Conta',
      content: `Para usar nossos serviços, você precisa:

• Fornecer informações verdadeiras e atualizadas
• Manter a segurança da sua conta
• Não compartilhar credenciais de login
• Ser responsável por todas as atividades na sua conta

Podemos suspender contas que:
• Violarem estes termos
• Apresentarem comportamento fraudulento
• Comprometerem a segurança da plataforma`
    },
    {
      id: 'payments',
      icon: CreditCard,
      title: '4. Pagamentos e Tarifas',
      content: `• Os valores das corridas são calculados com base em distância, tempo e demanda
• Aceitamos: dinheiro, cartão de crédito/débito, carteira digital
• Taxas de serviço: 15% sobre o valor da corrida
• Fundo de garantia: 5% para proteção de disputas
• Pagamentos são processados de forma segura
• Reembolsos: analisados caso a caso dentro de 7 dias úteis`
    },
    {
      id: 'responsibilities',
      icon: Shield,
      title: '5. Responsabilidades',
      content: `DO USUÁRIO:
• Verificar informações antes de confirmar
• Tratar motoristas/entregadores com respeito
• Pagar pelos serviços utilizados
• Comunicar problemas imediatamente

DA PLATAFORMA:
• Manter o app funcionando
• Processar pagamentos com segurança
• Mediar disputas entre usuários
• Proteger dados pessoais`
    },
    {
      id: 'prohibited',
      icon: AlertTriangle,
      title: '6. Condutas Proibidas',
      content: `É expressamente proibido:

• Transportar itens ilegais ou perigosos
• Assediar outros usuários
• Tentar burlar o sistema de pagamento
• Usar o app para atividades criminosas
• Danificar propriedade de terceiros
• Fornecer informações falsas

Violações resultam em suspensão permanente.`
    },
    {
      id: 'liability',
      icon: FileText,
      title: '7. Limitação de Responsabilidade',
      content: `NÃO NOS RESPONSABILIZAMOS POR:

• Atrasos causados por trânsito ou fatores externos
• Comportamento de motoristas/entregadores
• Itens esquecidos em veículos
• Danos a objetos frágeis durante transporte
• Problemas técnicos momentâneos

NOSSA RESPONSABILIDADE MÁXIMA: valor da corrida em questão.`
    },
    {
      id: 'privacy',
      icon: Shield,
      title: '8. Privacidade e Dados',
      content: `• Coletamos dados necessários para o serviço
• Usamos localização apenas durante o uso ativo
• Compartilhamos dados apenas com motoristas/entregadores envolvidos
• Mantemos dados por período legalmente exigido
• Você pode solicitar exclusão de dados a qualquer momento

Consulte nossa Política de Privacidade completa.`
    },
    {
      id: 'modifications',
      icon: FileText,
      title: '9. Modificações dos Termos',
      content: `• Podemos atualizar estes termos periodicamente
• Notificaremos sobre mudanças significativas
• Uso continuado após mudanças significa aceitação
• Versão atual: 2.1 (Janeiro 2024)
• Histórico de alterações disponível no site`
    },
    {
      id: 'jurisdiction',
      icon: MapPin,
      title: '10. Lei Aplicável e Foro',
      content: `• Lei aplicável: Legislação Angolana
• Foro eleito: Comarca de Luanda
• Disputas: Tentativa de mediação antes de ação judicial
• Idioma oficial: Português
• Vigência: Imediata após publicação`
    }
  ]

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <PageHeader title="Termos e Condições" canGoBack={true} />

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Introdução */}
        <View className="bg-white px-6 py-6 border-b border-gray-200">
          <View className="items-center mb-4">
            <FileText size={48} color="#E0212D" />
          </View>

          <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
            Termos e Condições de Uso
          </Text>

          <Text className="text-gray-600 text-center leading-6">
            Leia atentamente estes termos antes de utilizar nossos serviços.
            Eles constituem um contrato legal entre você e o Kandengue Atrevido.
          </Text>

          <View className="bg-yellow-50 p-3 rounded-lg mt-4">
            <Text className="text-yellow-800 text-sm text-center">
              ⚠️ Última atualização: 15 de Janeiro de 2024
            </Text>
          </View>
        </View>

        {/* Seções dos Termos */}
        <View className="px-6 mt-6">
          {termsSections.map(section => {
            const IconComponent = section.icon
            const isExpanded = isSectionExpanded(section.id)

            return (
              <View key={section.id} className="mb-3">
                <TouchableOpacity
                  className="bg-white rounded-2xl shadow-sm p-5"
                  onPress={() => toggleSection(section.id)}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-row items-start flex-1">
                      <IconComponent
                        size={20}
                        color="#E0212D"
                        className="mt-1 mr-3"
                      />
                      <Text className="text-lg font-semibold text-gray-900 flex-1">
                        {section.title}
                      </Text>
                    </View>
                    {isExpanded ? (
                      <ChevronUp size={20} color="#6B7280" />
                    ) : (
                      <ChevronDown size={20} color="#6B7280" />
                    )}
                  </View>

                  {isExpanded && (
                    <Text className="text-gray-700 leading-6 mt-4">
                      {section.content}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )
          })}
        </View>

        {/* Aceitação */}
        <View className="px-6 mt-6">
          <View className="bg-green-50 rounded-2xl p-5">
            <Text className="text-green-800 font-semibold text-center mb-2">
              ✅ Ao usar nosso aplicativo, você concorda com todos estes termos.
            </Text>
            <Text className="text-green-700 text-sm text-center">
              Se tiver dúvidas, entre em contato com nosso departamento
              jurídico.
            </Text>
          </View>
        </View>

        {/* Contato Legal */}
        <View className="px-6 mt-6">
          <TouchableOpacity
            className="bg-white rounded-2xl shadow p-5 flex-row items-center justify-between"
            onPress={handleContactLegal}
          >
            <View>
              <Text className="font-semibold text-gray-900">
                Dúvidas Legais?
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                Entre em contato com nosso departamento jurídico
              </Text>
            </View>
            <ExternalLink size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="px-6 mt-6">
          <View className="items-center">
            <Text className="text-gray-500 text-center text-sm">
              Kandengue Atrevido
              {'\n'}Luanda, Angola
              {'\n'}© 2024 Todos os direitos reservados
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
