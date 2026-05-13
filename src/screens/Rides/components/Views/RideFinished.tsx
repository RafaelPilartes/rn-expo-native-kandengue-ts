// src/screens/Ride/RideFinishedScreen.tsx
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import { Check, Star, MapPin, Navigation } from 'lucide-react-native'
import ImageView from 'react-native-image-viewing'
import { RideInterface } from '@/interfaces/IRide'
import { formatMoney } from '@/utils/formattedNumber'
import { useNavigation } from '@react-navigation/native'
import ROUTES from '@/constants/routes'
import { useRideFinishedFare } from '@/hooks/ride/useRideFinishedFare'
// import { useAppProvider } from '@/providers/AppProvider'

type RideFinishedScreenRoutePros = {
  rideId?: string
  rideDetails: RideInterface
}

export const RideCompletedScreen: React.FC<RideFinishedScreenRoutePros> = ({
  rideId,
  rideDetails
}) => {
  const navigation = useNavigation()

  const docId = rideId ?? rideDetails.id
  const hasPromo = !!rideDetails.promotion_usage_id

  // ESTADO PARA CONTROLAR CLICKS MÚLTIPLOS
  const [isNavigating, setIsNavigating] = useState(false)
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false)

  const { fare, isVerifying } = useRideFinishedFare(docId, rideDetails.fare, hasPromo)

  const grossAmount = fare.breakdown?.gross_amount
  const discount = fare.breakdown?.discount
  const hasDiscount = discount !== undefined && discount > 0
  const totalPaid = formatMoney(fare.total)

  // USAR useCallback PARA PREVENIR RECRIAÇÃO DAS FUNÇÕES
  const handleGoHome = useCallback(() => {
    if (isNavigating) return

    setIsNavigating(true)
    ;(navigation as any).navigate(ROUTES.HomeStack.HOME)

    setTimeout(() => setIsNavigating(false), 1000)
  }, [isNavigating, navigation])

  const handleRateRide = useCallback(() => {
    if (isNavigating) return

    setIsNavigating(true)
    ;(navigation as any).navigate(ROUTES.HomeStack.HOME)

    setTimeout(() => setIsNavigating(false), 1000)
  }, [isNavigating, navigation])

  const handleViewHistory = useCallback(() => {
    if (isNavigating) return

    setIsNavigating(true)
    ;(navigation as any).navigate(ROUTES.MainTab.HISTORY)

    setTimeout(() => setIsNavigating(false), 1000)
  }, [isNavigating, navigation])



  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        flexGrow: 1,
        paddingVertical: 40,
        // maxHeight: '90%',
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center'
      }}
      showsVerticalScrollIndicator={false}
    >
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
            Obrigado por usar o Kandengue. Esperamos que a sua experiência tenha
            sido ótima!
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
          <View className="border border-green-200 bg-green-50 rounded-xl p-4 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-green-800 font-semibold">
                Resumo de pagamento
              </Text>
              {isVerifying && <ActivityIndicator size="small" color="#059669" />}
            </View>

            {isVerifying && (
              <View className="items-center py-3">
                <ActivityIndicator size="large" color="#059669" />
                <Text className="text-green-700 text-sm mt-2">
                  A verificar promoção...
                </Text>
              </View>
            )}

            {!isVerifying && (
              <>
                {hasDiscount && (
                  <>
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-gray-500 text-sm">Valor original</Text>
                      <Text className="text-gray-500 text-sm line-through">
                        Kz {formatMoney(grossAmount!)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-green-700 text-sm font-medium">
                        Desconto aplicado
                      </Text>
                      <Text className="text-green-700 text-sm font-semibold">
                        − Kz {formatMoney(discount!)}
                      </Text>
                    </View>
                    <View className="h-px bg-green-200 mb-3" />
                  </>
                )}

                <View className="flex-row justify-between items-center">
                  <Text className="text-green-800 font-semibold text-base">
                    {hasDiscount ? 'Total a pagar' : 'Total da corrida'}
                  </Text>
                  <Text className="text-green-700 text-2xl font-bold">
                    Kz {totalPaid}
                  </Text>
                </View>

                {hasDiscount && (
                  <Text className="text-green-600 text-xs mt-2 text-right">
                    Poupou Kz {formatMoney(discount!)} com o código promocional
                  </Text>
                )}
              </>
            )}
          </View>

          {/* PROVA DE ENTREGA */}
          {rideDetails.proof_dropoff_photo && (
            <View className="mb-2">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Prova de Entrega
              </Text>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setIsImageViewerVisible(true)}
                className="w-full h-40 rounded-2xl overflow-hidden bg-gray-200 border border-gray-100"
              >
                <Image
                  source={{ uri: rideDetails.proof_dropoff_photo }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute bottom-0 left-0 right-0 bg-black/40 py-2 items-center">
                  <Text className="text-white text-xs font-medium">
                    Ver em tela cheia
                  </Text>
                </View>
              </TouchableOpacity>

              <ImageView
                images={[{ uri: rideDetails.proof_dropoff_photo }]}
                imageIndex={0}
                visible={isImageViewerVisible}
                onRequestClose={() => setIsImageViewerVisible(false)}
              />
            </View>
          )}
        </View>
      </View>

      {/* BOTÕES */}
      <View className="flex-row gap-2 mt-8 w-full max-w-md">
        {/* VOLTAR */}
        <TouchableOpacity
          className={`flex-1 rounded-xl py-4 flex-row items-center justify-center ${
            isNavigating ? 'bg-gray-300' : 'bg-gray-200'
          }`}
          onPress={handleGoHome}
          disabled={isNavigating}
          activeOpacity={0.7}
        >
          <Text
            className={`font-semibold text-base ${
              isNavigating ? 'text-gray-500' : 'text-gray-800'
            }`}
          >
            {isNavigating ? 'Navegando...' : 'Voltar ao Início'}
          </Text>
        </TouchableOpacity>

        {/* AVALIAR */}
        <TouchableOpacity
          className={`flex-1 rounded-xl py-4 flex-row items-center justify-center ${
            isNavigating ? 'bg-primary-100' : 'bg-primary-200'
          }`}
          onPress={handleRateRide}
          disabled={isNavigating}
          activeOpacity={0.7}
        >
          <Star size={18} color="white" />
          <Text className="text-white font-semibold text-base ml-2">
            {isNavigating ? '...' : 'Avaliar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* HISTÓRICO */}
      <TouchableOpacity
        className="mt-4"
        onPress={handleViewHistory}
        disabled={isNavigating}
        activeOpacity={0.7}
      >
        <Text
          className={`font-medium ${
            isNavigating ? 'text-gray-400' : 'text-primary-200'
          }`}
        >
          {isNavigating ? 'Navegando...' : 'Ver histórico de corridas →'}
        </Text>
      </TouchableOpacity>


    </ScrollView>
  )
}
