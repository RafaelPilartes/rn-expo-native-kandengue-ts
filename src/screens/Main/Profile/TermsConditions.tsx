// src/screens/TermsConditionsScreen.tsx
import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native'
import { useAlert } from '@/context/AlertContext'
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
import { PageHeader } from '@/components/PageHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { contentTermsConditions } from '@/data/appContent'

const IconMap: Record<string, any> = {
  FileText, Shield, CreditCard, User, MapPin, AlertTriangle, CheckCircle
}

export default function TermsConditionsScreen() {
  const navigation = useNavigation<any>()
  const { showAlert } = useAlert()
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
      showAlert('Erro', 'Não foi possível abrir o email.', 'error')
    )
  }



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

          <View className="bg-gray-100 p-3 rounded-lg mt-4">
            <Text className="text-gray-800 text-sm text-center">
              Última atualização: Abril de 2026
            </Text>
          </View>
        </View>

        {/* Seções dos Termos */}
        <View className="px-6 mt-6">
          {contentTermsConditions.map(section => {
            const IconComponent = IconMap[section.iconName] || FileText
            const isExpanded = isSectionExpanded(section.id)

            return (
              <View key={section.id} className="mb-3">
                <TouchableOpacity
                  className="bg-white rounded-2xl p-5"
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
          <View className="bg-gray-100 rounded-2xl p-5">
            <Text className="text-gray-800 font-semibold text-center mb-2">
              Ao usar nosso aplicativo, você concorda com todos estes termos.
            </Text>
            <Text className="text-gray-700 text-sm text-center">
              Se tiver dúvidas, entre em contato com nosso departamento
              jurídico.
            </Text>
          </View>
        </View>

        {/* Contato Legal */}
        <View className="px-6 mt-6">
          <TouchableOpacity
            className="bg-white rounded-2xl p-5 flex-row items-center justify-between"
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
