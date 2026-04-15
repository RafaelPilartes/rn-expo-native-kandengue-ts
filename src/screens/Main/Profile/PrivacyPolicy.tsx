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
  Share2,
  UserCheck,
  Globe,
  Archive,
  ShieldAlert,
  RefreshCw,
  Phone,
  CheckCircle
} from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { PageHeader } from '@/components/PageHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { contentPrivacyPolicy } from '@/data/appContent'

const IconMap: Record<string, any> = {
  User, Eye, Share2, Lock, UserCheck, Globe, Archive, ShieldAlert, RefreshCw, Phone, CheckCircle, Shield
}

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



  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <PageHeader title="Política de Privacidade" canGoBack={true} />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Header Section */}
        <View className="bg-white rounded-2xl p-6 mb-6">
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
        <View className="bg-gray-100 rounded-2xl p-5 mb-6">
          <Text className="text-gray-800 font-semibold mb-3">
            Resumo da Política
          </Text>
          <View className="space-y-2">
            <Text className="text-gray-700 text-sm">
              • Coletamos apenas dados necessários para o serviço
            </Text>
            <Text className="text-gray-700 text-sm">
              • Não vendemos seus dados a terceiros
            </Text>
            <Text className="text-gray-700 text-sm">
              • Protegemos suas informações com segurança robusta
            </Text>
            <Text className="text-gray-700 text-sm">
              • Você controla suas preferências de privacidade
            </Text>
          </View>
        </View>

        {/* Policy Sections */}
        {contentPrivacyPolicy.map(section => {
          const IconComponent = IconMap[section.iconName] || Shield
          return (
            <View key={section.id} className="mb-4">
              <TouchableOpacity
                className="bg-white rounded-2xl p-5"
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
        <View className="bg-gray-100 rounded-2xl p-6 mt-4">
          <Text className="text-gray-800 font-semibold text-lg mb-3">
            Você está no Controlo
          </Text>
          <Text className="text-gray-700 leading-6">
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
