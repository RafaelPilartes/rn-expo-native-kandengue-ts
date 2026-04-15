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
import { contentFaq } from '@/data/appContent'

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



  const filteredFaqs = contentFaq.filter(item => {
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
