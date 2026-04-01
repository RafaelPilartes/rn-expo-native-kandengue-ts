// src/screens/Ride/components/RideStatusIdle.tsx
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import {
  Clock,
  Users,
  MapPin,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react-native'
import { toDate } from '@/utils/formatDate'

interface RideStatusIdleProps {
  pickupDescription: string
  dropoffDescription: string
  estimatedTime?: string
  price: string
  searchStartTime?: Date
  onCancel?: () => void
  onAutoCancel?: (reason: string) => void
  onCenterMap?: () => void
}

type FireTimestamp = { seconds: number; nanoseconds: number }

export const RideStatusIdle: React.FC<RideStatusIdleProps> = ({
  pickupDescription,
  dropoffDescription,
  estimatedTime = '2-5 min',
  price,
  searchStartTime,
  onCancel,
  onAutoCancel,
  onCenterMap
}) => {
  const [showDetails, setShowDetails] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0) // segundos

  const startTime = toDate(searchStartTime)

  const COLOR_MAP: Record<string, string> = {
    'text-blue-600': '#2563EB',
    'text-orange-600': '#EA580C',
    'text-yellow-600': '#CA8A04',
    'text-red-600': '#DC2626'
  }

  // 🔹 Calcular tempo decorrido desde o searchStartTime
  useEffect(() => {
    if (!startTime) {
      setElapsedTime(0)
      return
    }

    const calculateElapsedTime = () => {
      const now = new Date()
      const start = new Date(startTime)
      const diffInSeconds = Math.floor((now.getTime() - start.getTime()) / 1000)
      setElapsedTime(Math.max(0, diffInSeconds))
    }

    // Calcular imediatamente
    calculateElapsedTime()

    // Atualizar a cada segundo
    const interval = setInterval(calculateElapsedTime, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSearchStatus = () => {
    if (elapsedTime < 90) {
      // 0 - 1:30min
      return {
        text: 'Buscando motoristas próximos...',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: '🔍',
        description: 'Procurando o entregador mais próximo da sua localização'
      }
    }
    if (elapsedTime < 150) {
      // 1:30min - 2:30min
      return {
        text: 'Expandindo busca na região...',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-red-300',
        icon: '🗺️',
        description: 'Ampliando a busca para encontrar um entregador disponível'
      }
    }
    if (elapsedTime < 240) {
      // 2:30min - 4min
      return {
        text: 'Aguardando motorista disponível',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: '⏳',
        description: 'Poucos entregadores disponíveis no momento. Aguarde...'
      }
    }
    return {
      text: 'Tempo de espera prolongado',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: '⚠️',
      description:
        'Estamos com dificuldade para encontrar um entregador. Você pode cancelar e tentar novamente.'
    }
  }

  const searchStatus = getSearchStatus()

  const getProgressPercentage = () => {
    // Progresso baseado no tempo (máximo 6 minutos = 360 segundos)
    return Math.min(95, (elapsedTime / 360) * 100)
  }

  const getTimeEstimate = () => {
    if (elapsedTime < 90) return '0 - 1min'
    if (elapsedTime < 150) return '1:30min - 2:30min'
    if (elapsedTime < 240) return '2:30min -4min'
    return 'Indefinido'
  }

  // AUTO-CANCELAMENTO
  useEffect(() => {
    if (elapsedTime >= 360) {
      onAutoCancel?.('Tempo de espera prolongado') // dispara cancelamento automático
    }
  }, [elapsedTime])

  return (
    <View className="absolute top-safe left-4 right-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">
            Procurando Entregador
          </Text>
          <Text className="text-gray-500 text-sm">
            {startTime
              ? 'Aguardando aceitação do pedido'
              : 'Preparando busca...'}
          </Text>
        </View>
      </View>

      {/* Status da Busca */}
      <View
        className={`p-3 rounded-lg mb-3 border ${searchStatus.bgColor} ${searchStatus.borderColor}`}
      >
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Clock
              size={16}
              color={searchStatus.color
                .replace('text-', '')
                .replace('-600', '-500')}
            />
            <Text className={`font-medium ml-2 ${searchStatus.color}`}>
              {searchStatus.text}
            </Text>
          </View>
          <Text
            className={`text-sm font-mono font-semibold ${searchStatus.color}`}
          >
            {formatElapsedTime(elapsedTime)}
          </Text>
        </View>

        {/* Descrição do status */}
        <Text className="text-gray-600 text-xs mb-2">
          {searchStatus.description}
        </Text>

        {/* Barra de progresso */}
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${getProgressPercentage()}%`,
              backgroundColor: COLOR_MAP[searchStatus.color]
            }}
          />
        </View>
      </View>

      {/* Informações Rápidas */}
      <View className="gap-2 mb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Users size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Previsão de aceitação</Text>
          </View>
          <Text className="text-gray-900 font-semibold">
            {getTimeEstimate()}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MapPin size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Valor da entrega</Text>
          </View>
          <Text className="text-green-600 font-bold text-lg">{price}</Text>
        </View>
      </View>

      {/* Botão para Detalhes */}
      <TouchableOpacity
        className="flex-row items-center justify-between bg-gray-50 p-3 rounded-lg mb-3"
        onPress={() => setShowDetails(!showDetails)}
      >
        <Text className="text-gray-700 font-medium">
          {showDetails ? 'Ocultar detalhes' : 'Ver detalhes da entrega'}
        </Text>
        {showDetails ? (
          <ChevronUp size={16} color="#6B7280" />
        ) : (
          <ChevronDown size={16} color="#6B7280" />
        )}
      </TouchableOpacity>

      {/* Detalhes Expandíveis */}
      {showDetails && (
        <View className="gap-3 mb-4">
          {/* Rota */}
          <View className="bg-blue-50 p-3 rounded-lg">
            <Text className="text-gray-800 font-semibold text-sm mb-2">
              Rota da Entrega
            </Text>
            <View className="gap-2">
              <View className="flex-row items-start">
                <View className="w-2 h-2 bg-gray-500 rounded-full mt-1.5 mr-2" />
                <Text
                  className="text-gray-700 text-sm flex-1"
                  numberOfLines={2}
                >
                  {pickupDescription}
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2" />
                <Text
                  className="text-gray-700 text-sm flex-1"
                  numberOfLines={2}
                >
                  {dropoffDescription}
                </Text>
              </View>
            </View>
          </View>

          {/* Informações Técnicas */}
          {startTime && (
            <View className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <Text className="text-gray-700 text-xs">
                <Text className="font-semibold">Busca iniciada:</Text>{' '}
                {new Date(startTime).toLocaleTimeString('pt-BR')}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Ações */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          className="flex-1 bg-gray-100 py-3 rounded-xl border border-gray-300"
          onPress={onCancel}
        >
          <Text className="text-gray-700 font-semibold text-center">
            Cancelar Pedido
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-blue-500 py-3 rounded-xl flex-row items-center justify-center"
          onPress={onCenterMap}
        >
          <MapPin size={18} color="white" />
          <Text className="text-white font-semibold ml-2">Ver Mapa</Text>
        </TouchableOpacity>
      </View>

      {/* Informação Adicional */}
      <View className="mt-3 bg-gray-50 p-2 rounded-lg">
        <Text className="text-gray-600 text-xs text-center">
          {elapsedTime < 90
            ? '⏱️ Buscando o melhor entregador para você...'
            : elapsedTime < 150
              ? '🔄 Ampliando a busca na sua região...'
              : '📞 Poucos entregadores disponíveis. Pedimos paciência.'}
        </Text>
      </View>

      {/* Alerta para tempo muito longo */}
      {elapsedTime > 180 && (
        <View className="mt-2 bg-red-50 p-2 rounded-lg border border-red-200">
          <View className="flex-row items-center">
            <AlertCircle size={14} color="#EF4444" />
            <Text className="text-red-700 text-xs ml-1 font-medium">
              Tempo de espera muito longo
            </Text>
          </View>
          <Text className="text-red-600 text-xs mt-1">
            Considere cancelar e tentar novamente em alguns minutos
          </Text>
        </View>
      )}
    </View>
  )
}
