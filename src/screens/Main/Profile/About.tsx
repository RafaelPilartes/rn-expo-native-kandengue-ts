// src/screens/About.tsx
import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native'
import {
  Info,
  Shield,
  Award,
  Users,
  MapPin,
  Star,
  Heart,
  Globe,
  ChevronRight,
  ExternalLink
} from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { PageHeader } from '@/components/PageHeader'
import { useAlert } from '@/context/AlertContext'
import {
  APP_VERSION,
  BUILD_NUMBER,
  DEVELOPER_SITE,
  LAST_UPDATE,
  SITE_URL
} from '@/constants/config'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AboutScreen() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const { showAlert } = useAlert()

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleOpenWebsite = () => {
    Linking.openURL(`${SITE_URL}`).catch(() =>
      showAlert('Erro', 'Não foi possível abrir o website.', 'error')
    )
  }

  const handleOpenPrivacyPolicy = () => {
    Linking.openURL(`${SITE_URL}/privacy`).catch(() =>
      showAlert(
        'Erro',
        'Não foi possível abrir a política de privacidade.',
        'error'
      )
    )
  }

  const handleOpenTerms = () => {
    Linking.openURL(`${SITE_URL}/terms`).catch(() =>
      showAlert('Erro', 'Não foi possível abrir os termos de uso.', 'error')
    )
  }

  const handleOpenDev = () => {
    Linking.openURL(`${DEVELOPER_SITE}`).catch(() =>
      showAlert(
        'Erro',
        'Não foi possível abrir os site do desenvolvedor.',
        'error'
      )
    )
  }

  const stats = [
    { icon: Users, value: '2.5K+', label: 'Usuários Ativos' },
    { icon: MapPin, value: '5+', label: 'Cidades' },
    { icon: Star, value: '4.8', label: 'Avaliação' },
    { icon: Award, value: '99%', label: 'Entregas no Prazo' }
  ]

  const features = [
    {
      icon: Shield,
      title: 'Segurança',
      description: 'Todos os nossos motoristas são verificados e treinados'
    },
    {
      icon: Globe,
      title: 'Cobertura',
      description: 'Atendemos em múltiplas cidades com ampla cobertura'
    },
    {
      icon: Heart,
      title: 'Compromisso',
      description: 'Comprometidos com a satisfação dos nossos clientes'
    }
  ]

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <PageHeader title="Sobre o App" canGoBack={true} />

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Hero Section */}
        <View className="bg-primary-200 px-6 py-8">
          <View className="items-center">
            <View className="w-20 h-20 bg-white rounded-2xl items-center justify-center mb-4">
              <Info size={40} color="#E0212D" />
            </View>
            <Text className="text-3xl font-bold text-white text-center">
              Kandengue Atrevido
            </Text>
            <Text className="text-white/90 text-lg text-center mt-2">
              Conectando pessoas, simplificando entregas
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="px-6 -mt-6">
          <View className="bg-white rounded-2xl shadow-lg p-6">
            <View className="flex-row flex-wrap justify-between">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <View key={index} className="w-1/2 items-center mb-4">
                    <IconComponent size={24} color="#E0212D" />
                    <Text className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </Text>
                    <Text className="text-gray-600 text-xs text-center">
                      {stat.label}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>
        </View>

        {/* Nossa História */}
        <View className="px-6 mt-6">
          <TouchableOpacity
            className="bg-white rounded-2xl shadow p-6"
            onPress={() => toggleSection('story')}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-bold text-gray-900">
                Nossa História
              </Text>
              <ChevronRight
                size={20}
                color="#6B7280"
                className={expandedSection === 'story' ? 'rotate-90' : ''}
              />
            </View>

            {expandedSection === 'story' && (
              <View className="mt-4">
                <Text className="text-gray-700 leading-6 mb-3">
                  Fundado em 2023, o{' '}
                  <Text className="font-bold">Kandengue Atrevido</Text> nasceu
                  da necessidade de conectar pessoas a serviços de transporte e
                  entregas de forma rápida, segura e acessível em Angola.
                </Text>
                <Text className="text-gray-700 leading-6">
                  Começamos como uma pequena startup em Luanda e hoje estamos
                  presentes em múltiplas cidades, sempre com o compromisso de
                  oferecer o melhor serviço aos nossos clientes e oportunidades
                  de renda para os nossos motoristas.
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Nossa Missão */}
        <View className="px-6 mt-4">
          <TouchableOpacity
            className="bg-white rounded-2xl shadow p-6"
            onPress={() => toggleSection('mission')}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-bold text-gray-900">
                Nossa Missão
              </Text>
              <ChevronRight
                size={20}
                color="#6B7280"
                className={expandedSection === 'mission' ? 'rotate-90' : ''}
              />
            </View>

            {expandedSection === 'mission' && (
              <View className="mt-4">
                <Text className="text-gray-700 leading-6 mb-4">
                  Facilitar a mobilidade urbana e revolucionar o setor de
                  entregas em Angola, oferecendo serviços de qualidade a
                  qualquer hora e lugar, enquanto criamos oportunidades
                  económicas sustentáveis.
                </Text>

                <View className="gap-3">
                  {features.map((feature, index) => {
                    const IconComponent = feature.icon
                    return (
                      <View key={index} className="flex-row items-start gap-2">
                        <IconComponent size={20} color="#E0212D" />
                        <View className="flex-1">
                          <Text className="font-semibold text-gray-900">
                            {feature.title}
                          </Text>
                          <Text className="text-gray-600 text-sm mt-1">
                            {feature.description}
                          </Text>
                        </View>
                      </View>
                    )
                  })}
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Informações Técnicas */}
        <View className="px-6 mt-4">
          <View className="bg-white rounded-2xl shadow p-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Informações do App
            </Text>

            <View className="gap-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Versão</Text>
                <Text className="font-semibold text-gray-900">
                  {APP_VERSION}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600">Build</Text>
                <Text className="font-semibold text-gray-900">
                  {BUILD_NUMBER}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600">Última Atualização</Text>
                <Text className="font-semibold text-gray-900">
                  {' '}
                  {LAST_UPDATE}{' '}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Links Rápidos */}
        <View className="px-6 mt-4">
          <View className="bg-white rounded-2xl shadow p-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Links Úteis
            </Text>

            <View className="gap-3">
              <TouchableOpacity
                className="flex-row justify-between items-center py-3"
                onPress={handleOpenWebsite}
              >
                <View className="flex-row items-center">
                  <Globe size={20} color="#6B7280" />
                  <Text className="text-gray-800 ml-3">Website Oficial</Text>
                </View>
                <ExternalLink size={16} color="#6B7280" />
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row justify-between items-center py-3"
                onPress={handleOpenPrivacyPolicy}
              >
                <View className="flex-row items-center">
                  <Shield size={20} color="#6B7280" />
                  <Text className="text-gray-800 ml-3">
                    Política de Privacidade
                  </Text>
                </View>
                <ExternalLink size={16} color="#6B7280" />
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row justify-between items-center py-3"
                onPress={handleOpenTerms}
              >
                <Text className="text-gray-800">Termos de Uso</Text>
                <ExternalLink size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="px-6 mt-6">
          <View className="items-center">
            <Text className="text-gray-400 text-sm mt-1 text-center">
              © 2024 Kandengue Atrevido. Todos os direitos reservados.
            </Text>
            <TouchableOpacity
              className="flex-row justify-between items-center py-3"
              onPress={handleOpenDev}
            >
              <Text className="text-gray-500 text-center text-sm">
                👨‍💻 Desenvolvido por Rafael Pilartes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
