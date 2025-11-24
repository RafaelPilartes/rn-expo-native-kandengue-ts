import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function RideTrackingScreen() {
  const [status, setStatus] = useState('Procurando motoboy...')

  useEffect(() => {
    const timer1 = setTimeout(() => setStatus('Motoboy a caminho 🚴‍♂️'), 3000)
    const timer2 = setTimeout(() => setStatus('Entrega em andamento 📦'), 7000)
    const timer3 = setTimeout(() => setStatus('Entrega concluída ✅'), 12000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text className="text-lg font-bold text-center mt-4">{status}</Text>
      <MapView
        style={{ flex: 1, marginTop: 10 }}
        initialRegion={{
          latitude: -8.839987,
          longitude: 13.289437,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }}
      >
        <Marker
          coordinate={{ latitude: -8.839987, longitude: 13.289437 }}
          title="Motoboy"
          description={status}
        />
      </MapView>
    </SafeAreaView>
  )
}
