import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  Image
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Download, Link } from 'lucide-react-native'
import { getStoreUrl } from '@/constants/storeUrl'

interface AppUpdateScreenProps {
  version?: string
  isMandatory?: boolean
  onLater?: () => void
  releaseNotes?: string[]
}

export default function UpdateAppScreen({
  version = '1.0.0',
  isMandatory = true,
  releaseNotes = [
    'Novo design da interface',
    'Melhorias de performance',
    'Correção de bugs críticos',
    'Novas funcionalidades de entrega'
  ],
  onLater
}: AppUpdateScreenProps) {
  const handleUpdate = async () => {
    const url = getStoreUrl()

    try {
      const canOpen = await Linking.canOpenURL(url || '')
      if (canOpen) {
        await Linking.openURL(url)
      } else {
        console.log('Não foi possível abrir a loja de aplicativos')
      }
    } catch (error) {
      console.error('Erro ao abrir loja:', error)
    }
  }

  const handleLater = () => {
    if (isMandatory) {
      return
    }
    console.log('Usuário escolheu atualizar depois')
    onLater?.()
  }
  return (
    <SafeAreaView className="flex-1 bg-primary-200">
      <View className="flex-1 px-6 justify-end">
        {/* Header */}
        <View className="items-start mb-8">
          <View className="mb-8">
            <Image
              source={require('@/assets/logo/png/logo-kandengue-white.png')}
              style={{ width: 200, height: 60, resizeMode: 'contain' }}
            />
          </View>

          <View className="items-start">
            <Text className="text-6xl font-bold text-white text-center">
              Nova
            </Text>
            <Text className="text-6xl font-bold text-white text-center">
              Versão
            </Text>
            <Text className="text-6xl font-bold text-white text-center">
              Disponível
            </Text>
          </View>
          <Text className="text-white text-lg text-start mt-2">
            Uma nova versão do Kandengue Atrevido está disponível. Por favor,
            atualize na {Platform.OS === 'ios' ? 'App Store' : 'Play Store'}{' '}
            para obter as melhorias e novidades.
          </Text>
        </View>

        {/* Novidades */}
        {/* <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            🎉 O que há de novo:
          </Text>

          <View className="space-y-2">
            {releaseNotes.map((note, index) => (
              <View key={index} className="flex-row items-start">
                <CheckCircle size={16} color="#10B981" className="mt-1 mr-3" />
                <Text className="text-gray-700 flex-1 text-sm">{note}</Text>
              </View>
            ))}
          </View>
        </View> */}
      </View>

      {/* Botões de Ação */}
      <View className="px-6 pb-8 pt-4">
        {/* Botão Principal - Instalar Agora */}
        <TouchableOpacity
          className="bg-white py-4 rounded-2xl flex-row items-center justify-center mb-3 gap-2"
          onPress={handleUpdate}
        >
          <Download size={20} color="#e0212d" className="mr-2" />
          <Text className="text-primary-200 font-semibold text-lg">
            Instalar Agora
          </Text>
          {/* <ArrowRight size={20} color="white" className="ml-2" /> */}
        </TouchableOpacity>

        {/* Botão Secundário - Só se não for obrigatório */}
        {!isMandatory && (
          <TouchableOpacity
            className="py-4 rounded-2xl border border-white"
            onPress={handleLater}
          >
            <Text className="text-white font-medium text-center">
              Lembrar Depois
            </Text>
          </TouchableOpacity>
        )}

        {/* Aviso para atualização obrigatória */}
        {/* {isMandatory && (
          <View className="mt-3 bg-orange-50 p-3 rounded-lg">
            <Text className="text-orange-800 text-xs text-center">
              ⚠️ Esta atualização é obrigatória para continuar usando o app
            </Text>
          </View>
        )} */}

        {/* Informações de Versão */}
        <View className="flex-row items-center justify-center mt-4">
          {/* Icon */}
          <Link size={16} color="#ffffff" />
          <Text className="text-white text-sm ml-2">Versão {version}</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
