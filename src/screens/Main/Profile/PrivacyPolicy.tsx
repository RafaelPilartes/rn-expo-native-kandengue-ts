// src/screens/PrivacyPolicyScreen.tsx
import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import {
  Shield,
  ChevronDown,
  ChevronUp,
  Lock,
  Eye,
  User,
  Share2
} from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { PageHeader } from '@/components/PageHeader'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function PrivacyPolicyScreen() {
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

  const sections = [
    {
      id: 'introduction',
      title: '1. Introdução',
      icon: Shield,
      content: `O Kandengue Atrevido valoriza sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você usa nossos serviços de transporte e entrega.

Nosso compromisso é proteger seus dados pessoais e ser transparente sobre nossas práticas de privacidade.`
    },
    {
      id: 'information-collection',
      title: '2. Informações que Coletamos',
      icon: User,
      content: `Coletamos os seguintes tipos de informações:

• Informações Pessoais: Nome, email, telefone, foto de perfil
• Informações de Localização: Dados de GPS para serviços de transporte
• Informações de Pagamento: Dados de cartão, histórico de transações
• Informações de Uso: Histórico de corridas, preferências, avaliações
• Informações do Dispositivo: Tipo de dispositivo, sistema operacional, identificadores únicos

Coletamos essas informações quando você:
• Cria uma conta
• Solicita serviços
• Interage com nosso suporte
• Usa recursos de localização`
    },
    {
      id: 'how-we-use',
      title: '3. Como Usamos Suas Informações',
      icon: Eye,
      content: `Usamos suas informações para:

• Fornecer e melhorar nossos serviços
• Processar pagamentos e prevenir fraudes
• Comunicar sobre serviços, promoções e atualizações
• Personalizar sua experiência
• Garantir segurança e conformidade legal
• Desenvolver novos produtos e recursos

Não vendemos seus dados pessoais a terceiros.`
    },
    {
      id: 'information-sharing',
      title: '4. Compartilhamento de Informações',
      icon: Share2,
      content: `Compartilhamos informações apenas nas seguintes situações:

• Com Motoristas Parceiros: Nome, localização de recolha, avaliação (apenas informações necessárias para o serviço)
• Com Prestadores de Serviço: Processamento de pagamentos, análise de dados, suporte ao cliente
• Por Requisição Legal: Quando exigido por lei ou processo legal
• Para Proteção: Para proteger nossos direitos, propriedade ou segurança

Motoristas veem apenas informações necessárias para completar o serviço solicitado.`
    },
    {
      id: 'data-security',
      title: '5. Segurança de Dados',
      icon: Lock,
      content: `Implementamos medidas de segurança robustas:

• Criptografia de dados em trânsito e em repouso
• Controlos de acesso baseados em funções
• Monitorização contínua de segurança
• Auditorias regulares de segurança
• Treinamento de segurança para nossa equipa

Apesar dessas medidas, nenhum sistema é 100% seguro. Recomendamos que você use senhas fortes e mantenha suas credenciais de login em segredo.`
    },
    {
      id: 'data-retention',
      title: '6. Retenção de Dados',
      content: `Mantemos suas informações apenas pelo tempo necessário:

• Dados da conta: Enquanto a conta estiver ativa
• Dados de transação: 7 anos (requisitos fiscais)
• Dados de localização: 6 meses
• Dados de suporte: 2 anos

Excluímos dados quando não são mais necessários para os fins coletados.`
    },
    {
      id: 'your-rights',
      title: '7. Seus Direitos',
      content: `Você tem os seguintes direitos:

• Acesso: Solicitar cópia de seus dados pessoais
• Retificação: Corrigir informações imprecisas
• Eliminação: Solicitar exclusão de dados (sujeito a limitações legais)
• Portabilidade: Receber dados em formato legível por máquina
• Oposição: Opor-se ao processamento em certas circunstâncias

Para exercer esses direitos, entre em contato com nosso Encarregado de Proteção de Dados.`
    },
    {
      id: 'cookies',
      title: '8. Cookies e Tecnologias Similares',
      content: `Usamos cookies e tecnologias similares para:

• Autenticação e segurança
• Preferências do utilizador
• Análise e desempenho
• Personalização de conteúdo

Você pode controlar cookies através das configurações do seu navegador, mas isso pode afetar a funcionalidade do serviço.`
    },
    {
      id: 'children-privacy',
      title: '9. Privacidade de Crianças',
      content: `Nossos serviços não são direcionados a crianças menores de 18 anos. Não coletamos intencionalmente informações de crianças. Se tomarmos conhecimento de que coletamos dados de uma criança sem consentimento parental, tomaremos medidas para remover essas informações.`
    },
    {
      id: 'international-transfers',
      title: '10. Transferências Internacionais',
      content: `Seus dados podem ser processados em servidores localizados fora de Angola. Garantimos que quaisquer transferências internacionais são protegidas por salvaguardas adequadas, como cláusulas contratuais padrão aprovadas.`
    },
    {
      id: 'changes',
      title: '11. Alterações a Esta Política',
      content: `Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas através do app ou email. O uso continuado dos serviços após alterações constitui aceitação da Política revisada.`
    },
    {
      id: 'contact',
      title: '12. Contacte-Nos',
      content: `Para questões sobre privacidade ou para exercer seus direitos:

Encarregado de Proteção de Dados
Email: privacy@kandengueatrevido.ao
Telefone: +244 222 333 444
Endereço: Av. 21 de Janeiro, Luanda, Angola

Tempo de resposta: Até 30 dias úteis`
    }
  ]

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <PageHeader title="Política de Privacidade" canGoBack={true} />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Header Section */}
        <View className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <View className="flex-row items-center mb-4">
            <Shield size={32} color="#E0212D" />
            <View className="ml-4 flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                Política de Privacidade
              </Text>
              <Text className="text-gray-600 mt-1">
                Última atualização: 11 de Novembro de 2025
              </Text>
            </View>
          </View>

          <Text className="text-gray-700 leading-6">
            Sua privacidade é fundamental para nós. Esta política explica como
            protegemos e utilizamos suas informações no Kandengue Atrevido.
          </Text>
        </View>

        {/* Quick Summary */}
        <View className="bg-blue-50 rounded-2xl p-5 mb-6">
          <Text className="text-blue-800 font-semibold mb-3">
            🔒 Resumo da Política
          </Text>
          <View className="space-y-2">
            <Text className="text-blue-700 text-sm">
              • Coletamos apenas dados necessários para o serviço
            </Text>
            <Text className="text-blue-700 text-sm">
              • Não vendemos seus dados a terceiros
            </Text>
            <Text className="text-blue-700 text-sm">
              • Protegemos suas informações com segurança robusta
            </Text>
            <Text className="text-blue-700 text-sm">
              • Você controla suas preferências de privacidade
            </Text>
          </View>
        </View>

        {/* Policy Sections */}
        {sections.map(section => {
          const IconComponent = section.icon || Shield
          return (
            <View key={section.id} className="mb-4">
              <TouchableOpacity
                className="bg-white rounded-2xl shadow-sm p-5"
                onPress={() => toggleSection(section.id)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 pr-4">
                    <View className="flex-row items-center mb-2">
                      <IconComponent size={20} color="#E0212D" />
                      <Text className="text-lg font-semibold text-gray-900 ml-2">
                        {section.title}
                      </Text>
                    </View>

                    {isSectionExpanded(section.id) && (
                      <Text className="text-gray-700 leading-6">
                        {section.content}
                      </Text>
                    )}
                  </View>

                  {isSectionExpanded(section.id) ? (
                    <ChevronUp size={20} color="#6B7280" />
                  ) : (
                    <ChevronDown size={20} color="#6B7280" />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )
        })}

        {/* Your Control */}
        <View className="bg-green-50 rounded-2xl p-6 mt-4">
          <Text className="text-green-800 font-semibold text-lg mb-3">
            🎯 Você está no Controlo
          </Text>
          <Text className="text-green-700 leading-6">
            Você pode gerir suas preferências de privacidade a qualquer momento
            através das configurações do app. Temos ferramentas para você
            visualizar, corrigir ou excluir seus dados pessoais.
          </Text>
        </View>

        {/* Compliance */}
        <View className="bg-gray-100 rounded-2xl p-5 mt-6">
          <Text className="text-gray-800 font-semibold mb-2">
            Conformidade Legal
          </Text>
          <Text className="text-gray-600 text-sm">
            Esta política está em conformidade com a Lei de Proteção de Dados
            Pessoais de Angola e melhores práticas internacionais de
            privacidade.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
