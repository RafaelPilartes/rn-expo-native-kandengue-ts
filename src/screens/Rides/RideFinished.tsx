// src/screens/Ride/RideFinishedScreen.tsx
import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Check, Star, MapPin, Navigation } from 'lucide-react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import ROUTES from '@/constants/routes'
// import { useAppProvider } from '@/providers/AppProvider'
import { RideInterface } from '@/interfaces/IRide'
import { formatMoney } from '@/utils/formattedNumber'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParamList } from '@/types/navigation'
import { SafeAreaView } from 'react-native-safe-area-context'

type RideFinishedScreenRouteParams = {
  rideId?: string
  rideDetails: RideInterface
}

export default function RideFinishedScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>()

  // CONST { navigationMainStack, navigationHomeStack } = useAppProvider() // Removed
  const route = useRoute()
  const { rideId, rideDetails } = route.params as RideFinishedScreenRouteParams

  const totalPaid = `Kz ${formatMoney(rideDetails.fare.total)}`

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center px-6 py-8">
          {/* CARD */}
          <View className="bg-white rounded-3xl shadow-md w-full max-w-md overflow-hidden">
            {/* HEADER */}
            <View className="p-6 items-center">
              <View className="w-24 h-24 rounded-full bg-primary-200 justify-center items-center mb-4">
                <Check size={50} color="white" />
              </View>

              <Text className="text-2xl font-bold text-gray-900 mb-1">
                Corrida Finalizada!
              </Text>

              <Text className="text-gray-600 text-center">
                Obrigado por usar o Kandengue. Esperamos que a sua experiência
                tenha sido ótima!
              </Text>
            </View>

            {/* BODY */}
            <View className="p-6">
              {/* Ride ID */}
              {rideId && (
                <View className="bg-gray-100 rounded-lg p-3 mb-4">
                  <Text className="text-gray-600 text-xs text-center">
                    Número da Corrida: #{rideId}
                  </Text>
                </View>
              )}

              {/* ROTA */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">
                  Rota da Corrida
                </Text>

                <View className="space-y-3">
                  {/* Pickup */}
                  <View className="flex-row items-start">
                    <View className="w-7 h-7 bg-green-600 rounded-full items-center justify-center mr-3 mt-0.5">
                      <MapPin size={14} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-500 text-sm">Recolha</Text>
                      <Text className="text-gray-900 font-medium">
                        {rideDetails.pickup.description}
                      </Text>
                    </View>
                  </View>

                  {/* Dropoff */}
                  <View className="flex-row items-start">
                    <View className="w-7 h-7 bg-red-600 rounded-full items-center justify-center mr-3 mt-0.5">
                      <Navigation size={14} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-500 text-sm">Destino</Text>
                      <Text className="text-gray-900 font-medium">
                        {rideDetails.dropoff.description}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* PAGAMENTO */}
              <View className="border border-green-200 bg-green-50 rounded-xl p-4">
                <Text className="text-green-800 font-semibold mb-1">
                  Total da corrida
                </Text>

                <Text className="text-green-700 text-2xl font-bold">
                  {totalPaid}
                </Text>

                <Text className="text-green-700 text-xs mt-1">
                  O valor final da corrida.
                </Text>
              </View>
            </View>
          </View>

          {/* BOTÕES */}
          <View className="flex-row gap-2 mt-8 w-full max-w-md">
            {/* VOLTAR */}
            <TouchableOpacity
              className="flex-1 bg-gray-200 rounded-xl py-4 flex-row items-center justify-center"
              onPress={() => (navigation as any).navigate(ROUTES.MainTab.HOME)}
            >
              <Text className="text-gray-800 font-semibold text-base">
                Voltar ao Início
              </Text>
            </TouchableOpacity>

            {/* AVALIAR */}
            <TouchableOpacity
              className="flex-1 bg-primary-200 rounded-xl py-4 flex-row items-center justify-center"
              onPress={() => {
                navigation.navigate(ROUTES.HomeStack.HOME)
                // navigationMainStack.navigate(ROUTES.Ride.RIDE_RATING, {
                //   rideId,
                //   rideDetails,
                // });
              }}
            >
              <Star size={18} color="white" />
              <Text className="text-white font-semibold text-base ml-2">
                Avaliar
              </Text>
            </TouchableOpacity>
          </View>

          {/* HISTÓRICO */}
          <TouchableOpacity
            className="mt-4"
            onPress={() => (navigation as any).navigate(ROUTES.MainTab.HISTORY)}
          >
            <Text className="text-primary-200 font-medium">
              Ver histórico de corridas →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
