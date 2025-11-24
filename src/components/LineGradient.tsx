// src/components/LineGradient.tsx
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Image, View, ViewStyle } from 'react-native'
import { BgWaveFooter } from '@/constants/images'

type Props = {
  colors?: string[]
  style?: ViewStyle
}

const LineGradient: React.FC<Props> = ({
  colors = ['#8f050f', '#c0010e', '#E0212D']
}) => {
  return (
    // <View className="absolute bottom-0 right-0 h-4 w-screen bg-primary-200" />

    // <LinearGradient
    //   colors={colors}
    //   start={{ x: 0, y: 0.5 }}
    //   end={{ x: 1, y: 0.5 }}
    //   className="h-[2px] rounded-full my-3"
    //   style={{
    //     position: 'absolute',
    //     height: 10,
    //     bottom: -10,
    //     right: 0,
    //     left: 0,
    //   }}
    // />

    <View className="absolute bottom-0 left-0 right-0">
      {/* <Image
        source={BgWaveFooter}
        style={{ width: 430, height: 50, resizeMode: 'contain' }}
      /> */}
    </View>
  )
}

export default LineGradient
