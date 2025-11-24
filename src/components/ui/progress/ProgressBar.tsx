// src/components/ui/progress/ProgressBar.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface ProgressBarProps {
  progress: number; // valor entre 0 e 1
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  animated?: boolean; // anima a mudança de progresso
  duration?: number; // duração da animação (ms)
}

export default function ProgressBar({
  progress = 24,
  height = 5,
  color = '#e0212d',
  backgroundColor = '#E5E7EB',
  style,
  animated = true,
  duration = 500,
}: ProgressBarProps) {
  // convert progress to decimal .
  const progressDecimal = progress / 100;

  const animatedValue = useRef(new Animated.Value(progressDecimal)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: progressDecimal,
        duration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(progressDecimal);
    }
  }, [progressDecimal, animated, duration]);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[
        {
          width: '100%',
          height,
          borderRadius: height / 2,
          backgroundColor,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: widthInterpolated,
          height: '100%',
          backgroundColor: color,
        }}
      />
    </View>
  );
}
