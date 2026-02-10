// src/screens/Complaints.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { useAlert } from '@/context/AlertContext'
import {
  Send,
  AlertTriangle,
  Clock,
  User,
  Package,
  MapPin,
  CreditCard,
  Smartphone
} from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { PageHeader } from '@/components/PageHeader'
import { useComplaintsViewModel } from '@/viewModels/ComplaintViewModel'
import { useAuthStore } from '@/storage/store/useAuthStore'
import { ComplaintEntity } from '@/core/entities/Complaint'
import type {
  ComplaintType,
  ComplaintPriority,
  ContactPreference
} from '@/core/interfaces/IComplaintRepository'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ComplaintsScreen() {
  const navigation = useNavigation<any>()
  const { user } = useAuthStore()
  const { showAlert } = useAlert()
  const { createComplaint, isLoadingUpdateComplaint } = useComplaintsViewModel()

  const [formData, setFormData] = useState({
    type: '' as ComplaintType,
    subject: '',
    description: '',
    priority: 'medium' as ComplaintPriority,
    contact_preference: 'email' as ContactPreference,
    ride_id: '' // Opcional - pode ser preenchido se vier de uma corrida específica
  })

  // Tipos de reclamação baseados na interface
  const complaintTypes: Array<{ id: ComplaintType; label: string; icon: any }> =
    [
      { id: 'service_quality', label: 'Qualidade do Serviço', icon: Package },
      {
        id: 'driver_behavior',
        label: 'Comportamento do Motorista',
        icon: User
      },
      {
        id: 'payment_issue',
        label: 'Problema com Pagamento',
        icon: CreditCard
      },
      {
        id: 'app_technical',
        label: 'Problema Técnico no App',
        icon: Smartphone
      },
      {
        id: 'safety_concern',
        label: 'Preocupação com Segurança',
        icon: AlertTriangle
      },
      { id: 'other', label: 'Outro', icon: MapPin }
    ]

  // Prioridades baseadas na interface
  const priorities: Array<{
    id: ComplaintPriority
    label: string
    color: string
  }> = [
    {
      id: 'low',
      label: 'Baixa',
      color: 'bg-green-100 text-green-800 green-300'
    },
    {
      id: 'medium',
      label: 'Média',
      color: 'bg-yellow-100 text-yellow-800 yellow-300'
    },
    {
      id: 'high',
      label: 'Alta',
      color: 'bg-orange-100 text-orange-800 orange-300'
    }
  ]

  // Opções de contato baseadas na interface
  const contactOptions: Array<{ id: ContactPreference; label: string }> = [
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Telefone' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'app_notification', label: 'Notificação no App' }
  ]

  const handleTypeSelect = (type: ComplaintType) => {
    setFormData(prev => ({ ...prev, type }))
  }

  const handlePrioritySelect = (priority: ComplaintPriority) => {
    setFormData(prev => ({ ...prev, priority }))
  }

  const handleContactSelect = (contact_preference: ContactPreference) => {
    setFormData(prev => ({ ...prev, contact_preference }))
  }

  const handleSubmit = async () => {
    if (!user?.id) {
      showAlert(
        'Erro',
        'Usuário não identificado. Faça login novamente.',
        'error'
      )
      return
    }

    if (!formData.type) {
      showAlert(
        'Atenção',
        'Por favor, selecione o tipo de problema.',
        'warning'
      )
      return
    }

    if (!formData.subject.trim()) {
      showAlert('Atenção', 'Por favor, informe o assunto.', 'warning')
      return
    }

    if (!formData.description.trim()) {
      showAlert('Atenção', 'Por favor, descreva o problema.', 'warning')
      return
    }

    try {
      // Criar a entidade de reclamação
      const complaintData = {
        user_id: user.id,
        type: formData.type,
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        contact_preference: formData.contact_preference,
        status: 'open' as const
      }

      // Validar usando a entidade
      const complaintEntity = new ComplaintEntity(complaintData)

      const validation = complaintEntity.validate()
      if (!validation.isValid) {
        showAlert('Erro de Validação', validation.errors.join('\n'), 'error')
        return
      }

      // Enviar para o backend
      await createComplaint.mutateAsync(complaintEntity.toJSON())

      showAlert(
        'Reclamação Enviada',
        `Sua reclamação foi registrada com sucesso. \n\nTempo estimado para resolução: ${complaintEntity.getEstimatedResolutionTime()}`,
        'success',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      )

      // Reset form
      setFormData({
        type: '' as ComplaintType,
        subject: '',
        description: '',
        priority: 'medium' as ComplaintPriority,
        contact_preference: 'email' as ContactPreference,
        ride_id: ''
      })
    } catch (error: any) {
      console.error('Erro ao enviar reclamação:', error)
      showAlert(
        'Erro',
        error.message ||
          'Não foi possível enviar sua reclamação. Tente novamente.',
        'error'
      )
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <PageHeader title="Enviar Reclamação" canGoBack={true} />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Tipo de Problema */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            1. Tipo de Reclamação *
          </Text>

          <View className="flex-row flex-wrap -mx-1">
            {complaintTypes.map(type => {
              const IconComponent = type.icon
              const isSelected = formData.type === type.id

              return (
                <TouchableOpacity
                  key={type.id}
                  className="w-1/2 px-1 mb-2"
                  onPress={() => handleTypeSelect(type.id)}
                >
                  <View
                    className={`bg-white rounded-xl p-3 border-2 ${
                      isSelected
                        ? 'border-primary-200 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <View className="flex-row items-center">
                      <IconComponent
                        size={18}
                        color={isSelected ? '#E0212D' : '#6B7280'}
                      />
                      <Text
                        className={`text-sm font-medium ml-2 flex-1 ${
                          isSelected ? 'text-primary-200' : 'text-gray-700'
                        }`}
                      >
                        {type.label}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Assunto */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            2. Assunto *
          </Text>

          <TextInput
            value={formData.subject}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, subject: text }))
            }
            placeholder="Resuma o problema em poucas palavras"
            className="bg-white rounded-xl p-4 text-gray-800 shadow border border-gray-200"
            maxLength={100}
          />

          <View className="flex-row justify-between mt-1">
            <Text className="text-gray-500 text-xs">Mínimo 5 caracteres</Text>
            <Text className="text-gray-500 text-xs">
              {formData.subject.length}/100 caracteres
            </Text>
          </View>
        </View>

        {/* Descrição Detalhada */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            3. Descrição Detalhada *
          </Text>

          <TextInput
            value={formData.description}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, description: text }))
            }
            placeholder={`Descreva o problema em detalhes. Inclua:\n• O que aconteceu exatamente?\n• Quando ocorreu (data e hora)?\n• Número da corrida (se aplicável)\n• Qual foi o impacto para você?`}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            className="bg-white rounded-xl p-4 text-gray-800 shadow border border-gray-200 min-h-[140px]"
            maxLength={1000}
          />

          <View className="flex-row justify-between mt-1">
            <Text className="text-gray-500 text-xs">Mínimo 10 caracteres</Text>
            <Text className="text-gray-500 text-xs">
              {formData.description.length}/1000 caracteres
            </Text>
          </View>
        </View>

        {/* Prioridade */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            4. Nível de Urgência
          </Text>

          <View className="flex-row flex-wrap -mx-1">
            {priorities.map(priority => {
              const isSelected = formData.priority === priority.id

              return (
                <TouchableOpacity
                  key={priority.id}
                  className="w-1/2 px-1 mb-2"
                  onPress={() => handlePrioritySelect(priority.id)}
                >
                  <View
                    className={`rounded-xl p-3 border-2 ${
                      isSelected
                        ? `${priority.color.split(' ')[0]} border-${
                            priority.color.split(' ')[2]
                          }`
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-center font-medium ${
                        isSelected
                          ? priority.color.split(' ')[1]
                          : 'text-gray-700'
                      }`}
                    >
                      {priority.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Preferência de Contato */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            5. Como prefere ser contactado?
          </Text>

          <View className="flex-row flex-wrap -mx-1">
            {contactOptions.map(option => {
              const isSelected = formData.contact_preference === option.id

              return (
                <TouchableOpacity
                  key={option.id}
                  className="w-1/2 px-1 mb-2"
                  onPress={() => handleContactSelect(option.id)}
                >
                  <View
                    className={`rounded-xl p-3 border-2 ${
                      isSelected
                        ? 'bg-primary-50 border-primary-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-center font-medium ${
                        isSelected ? 'text-primary-200' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Informações de Tempo de Resolução */}
        {formData.type && formData.priority && (
          <View className="mb-6 bg-green-50 rounded-2xl p-4">
            <View className="flex-row items-center">
              <Clock size={18} color="#059669" />
              <Text className="text-green-800 font-semibold ml-2">
                Tempo Estimado de Resolução
              </Text>
            </View>
            <Text className="text-green-700 text-sm mt-1">
              Com base na prioridade selecionada, esperamos resolver em:{' '}
              <Text className="font-bold">
                {new ComplaintEntity({
                  id: '',
                  user_id: user?.id || '',
                  type: formData.type,
                  subject: formData.subject,
                  description: formData.description,
                  priority: formData.priority,
                  contact_preference: formData.contact_preference,
                  status: 'open'
                }).getEstimatedResolutionTime()}
              </Text>
            </Text>
          </View>
        )}

        {/* Botão de Envio */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={
            isLoadingUpdateComplaint ||
            !formData.type ||
            !formData.subject.trim() ||
            !formData.description.trim()
          }
          className={`rounded-xl py-4 flex-row justify-center items-center shadow-lg ${
            isLoadingUpdateComplaint ||
            !formData.type ||
            !formData.subject.trim() ||
            !formData.description.trim()
              ? 'bg-gray-400'
              : 'bg-primary-200'
          }`}
        >
          {isLoadingUpdateComplaint ? (
            <Clock size={20} color="white" className="mr-2" />
          ) : (
            <Send size={20} color="white" className="mr-2" />
          )}
          <Text className="text-white font-semibold text-lg">
            {isLoadingUpdateComplaint ? 'Enviando...' : 'Enviar Reclamação'}
          </Text>
        </TouchableOpacity>

        {/* Informações de Suporte */}
        <View className="mt-6 bg-gray-100 rounded-xl p-4">
          <Text className="text-gray-700 text-sm text-center">
            📞 Atendimento 24h: +244 923 456 789{'\n'}
            📧 Email: support@kandengueatrevido.com{'\n'}
            🔐 Todas as informações são tratadas com confidencialidade
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
