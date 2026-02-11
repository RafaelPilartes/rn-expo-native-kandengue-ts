// src/screens/Main/History/components/RideItem.tsx
import React, { memo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import {
  Bike,
  Car,
  Package,
  Calendar,
  Clock,
  Navigation
} from 'lucide-react-native'
import StatusTag from './StatusTag'
import { RideInterface } from '@/interfaces/IRide'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatFullDate } from '@/utils/formatDate'
import Animated, { FadeInDown } from 'react-native-reanimated'

type Props = {
  item: RideInterface
  onPress?: (item: RideInterface) => void
  index?: number
}

// Icon Config
const iconConfig: Record<string, any> = {
  motorcycle: {
    icon: Bike,
    color: '#DC2626',
    bg: 'bg-red-50',
    border: 'border-red-100'
  },
  car: {
    icon: Car,
    color: '#2563EB',
    bg: 'bg-blue-50',
    border: 'border-blue-100'
  },
  delivery: {
    icon: Package,
    color: '#059669',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100'
  },
  bicycle: {
    icon: Bike,
    color: '#D97706',
    bg: 'bg-amber-50',
    border: 'border-amber-100'
  },
  default: {
    icon: Car,
    color: '#6B7280',
    bg: 'bg-gray-50',
    border: 'border-gray-100'
  }
}

const typeLabels: Record<string, string> = {
  motorcycle: 'Moto',
  car: 'Carro',
  delivery: 'Entrega',
  bicycle: 'Bicicleta'
}

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
}

function RideItemComponent({ item, onPress, index = 0 }: Props) {
  const rideType = (item.type || 'car') as keyof typeof iconConfig
  const config = iconConfig[rideType] || iconConfig.default
  const Icon = config.icon

  const handlePress = () => {
    onPress?.(item)
  }

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <TouchableOpacity
        className="bg-white mx-5 mb-4 rounded-3xl shadow-sm shadow-slate-200 border border-slate-100 overflow-hidden"
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {/* Header Section */}
        <View className="flex-row justify-between items-center p-4 bg-slate-50/50 border-b border-slate-100">
          <View className="flex-row items-center gap-3">
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${config.bg} border ${config.border}`}
            >
              <Icon size={20} color={config.color} />
            </View>
            <View>
              <Text className="text-base font-bold text-slate-800 capitalize">
                {typeLabels[rideType] || 'Corrida'}
              </Text>
              <View className="flex-row items-center mt-0.5">
                <Calendar size={12} color="#94A3B8" className="mr-1" />
                <Text className="text-xs text-slate-500 font-medium">
                  {formatFullDate(item.created_at, 'dd MMM yyyy - HH:mm')}
                </Text>
              </View>
            </View>
          </View>
          <StatusTag status={item.status} />
        </View>

        {/* Route Section */}
        <View className="p-5">
          {/* Route Visualizer */}
          <View className="flex-row relative">
            {/* Timeline Line */}
            <View className="items-center mr-4 pt-1.5">
              <View className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <View className="w-[1px] flex-1 bg-slate-200 my-1" />
              <View className="w-2.5 h-2.5 rounded-sm bg-slate-800" />
            </View>

            <View className="flex-1 gap-6">
              {/* Pickup */}
              <View>
                <Text className="text-[10px] font-bold text-slate-400 tracking-wider mb-0.5">
                  ORIGEM
                </Text>
                <Text
                  className="text-sm font-semibold text-slate-700 leading-5"
                  numberOfLines={1}
                >
                  {item.pickup.name}
                </Text>
                <Text className="text-sm text-slate-500 leading-5">
                  {item.pickup.description}
                </Text>
              </View>

              {/* Dropoff */}
              <View>
                <Text className="text-[10px] font-bold text-slate-400 tracking-wider mb-0.5">
                  DESTINO
                </Text>
                <Text
                  className="text-sm font-semibold text-slate-700 leading-5"
                  numberOfLines={1}
                >
                  {item.dropoff.name}
                </Text>
                <Text className="text-sm text-slate-500 leading-5">
                  {item.dropoff.description}
                </Text>
              </View>
            </View>
          </View>

          {/* Footer Info */}
          <View className="flex-row justify-between items-end mt-6 pt-4 border-t border-slate-50 dashed">
            <View className="flex-row gap-4">
              <View className="flex-row items-center bg-slate-50 px-2 py-1 rounded-md">
                <Clock size={14} color="#64748B" className="mr-1.5" />
                <Text className="text-xs font-semibold text-slate-600">
                  {formatDuration(item.duration)}
                </Text>
              </View>
              <View className="flex-row items-center bg-slate-50 px-2 py-1 rounded-md">
                <Navigation size={14} color="#64748B" className="mr-1.5" />
                <Text className="text-xs font-semibold text-slate-600">
                  {item.distance.toFixed(1)} km
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Text className="text-lg font-extrabold text-slate-900">
                {formatCurrency(
                  item.status === 'canceled' ? 0 : item.fare?.total || 0
                )}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default memo(RideItemComponent)
