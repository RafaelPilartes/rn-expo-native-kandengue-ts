import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageSourcePropType
} from 'react-native'
import { ArrowRight } from 'lucide-react-native'

type ServiceCardProps = {
  title: string
  description: string
  image: ImageSourcePropType
  badgeText?: string
  badgeVariant?: 'active' | 'soon'
  onPress?: () => void
}

export default function ServiceCard({
  title,
  description,
  image,
  badgeText = 'Disponível',
  badgeVariant = 'active',
  onPress
}: ServiceCardProps) {
  const badgeBg = badgeVariant === 'active' ? 'bg-primary-100' : 'bg-slate-100'
  const badgeTextColor =
    badgeVariant === 'active' ? 'text-primary-200' : 'text-slate-400'

  const borderColor = badgeVariant === 'active' ? '#e0212d' : '#CBD5E1'

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.shadow,
        { borderLeftWidth: 3, borderLeftColor: borderColor }
      ]}
      className="bg-white rounded-3xl overflow-hidden border border-slate-100"
    >
      <View className="flex-row min-h-[140px]">
        {/* Content Left */}
        <View className="flex-1 p-5 justify-between">
          {/* Badge */}
          <View className="flex-row">
            <View className={`px-2.5 py-1 rounded-full ${badgeBg}`}>
              <Text className={`text-xs font-semibold ${badgeTextColor}`}>
                {badgeText}
              </Text>
            </View>
          </View>

          {/* Text */}
          <View className="mt-3">
            <Text className="text-lg font-bold text-slate-900 mb-1">
              {title}
            </Text>
            <Text className="text-sm text-slate-500 leading-5">
              {description}
            </Text>
          </View>

          {/* CTA */}
          <View className="flex-row items-center mt-3">
            <Text className="text-sm font-semibold text-slate-900 mr-1">
              Solicitar
            </Text>
            <ArrowRight size={14} color="#0F172A" />
          </View>
        </View>

        {/* Illustration Right */}
        <View className="w-[130px] items-center justify-center">
          <Image source={image} className="w-28 h-28" resizeMode="contain" />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2
  }
})
