import React from 'react'
import { View, ActivityIndicator } from 'react-native'

import { DefaultTheme } from '@/styles/theme/DefaultTheme'
import { Image } from 'react-native'

export default function LoadingScreen() {
  return (
    <View className="bg-red-600 flex-1 items-center justify-center relative">
      <View className="flex flex-col">
        <Image
          source={require('@/assets/logo/png/logo-kandengue-white.png')}
          style={{ width: 260, resizeMode: 'contain' }}
        />

        <View className="absolute bottom-12 left-0 right-0 items-center">
          <ActivityIndicator color={DefaultTheme.colors.white} size={50} />
        </View>
      </View>
    </View>
  )
}
