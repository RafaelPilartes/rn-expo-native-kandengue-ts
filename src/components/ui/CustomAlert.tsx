import React, { useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated'
import { useAlert } from '../../context/AlertContext'

const { width } = Dimensions.get('window')

export const CustomAlert = () => {
  const { alertVisible, alertConfig, hideAlert } = useAlert()
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.8)

  useEffect(() => {
    if (alertVisible) {
      opacity.value = withTiming(1, { duration: 200 })
      scale.value = withSpring(1)
    } else {
      opacity.value = withTiming(0, { duration: 200 })
      scale.value = withTiming(0.8, { duration: 200 })
    }
  }, [alertVisible])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }]
    }
  })

  if (!alertVisible) return null

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <Animated.View style={[styles.alertBox, animatedStyle]}>
        <Text style={styles.title}>{alertConfig.title}</Text>
        <Text style={styles.message}>{alertConfig.message}</Text>
        <View style={styles.buttonContainer}>
          {alertConfig.buttons.length > 0 ? (
            alertConfig.buttons.map((btn, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (btn.onPress) btn.onPress()
                  hideAlert()
                }}
                style={[
                  styles.button,
                  btn.style === 'destructive' && styles.destructiveButton
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    btn.style === 'destructive' && styles.destructiveText
                  ]}
                >
                  {btn.text}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <TouchableOpacity onPress={hideAlert} style={styles.button}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999 // Ensure it's on top
  },
  alertBox: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%'
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  destructiveButton: {
    backgroundColor: '#dc3545'
  },
  destructiveText: {
    color: 'white'
  }
})
