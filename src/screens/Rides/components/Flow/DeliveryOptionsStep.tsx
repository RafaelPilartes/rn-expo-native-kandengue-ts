// src/screens/Rides/components/Flow/DeliveryOptionsStep.tsx
import React, { useRef, useCallback, memo, useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard
} from 'react-native'
import {
  ArrowLeft,
  ArrowRight,
  Package,
  ChevronRight,
  Banknote,
  CreditCard,
  Wallet
} from 'lucide-react-native'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useRideFlowStore } from '@/storage/store/useRideFlowStore'
import { useAuthStore } from '@/storage/store/useAuthStore'
import { ArticlePickerSheet } from './ArticlePickerSheet'
import { SenderReceiverSelector } from './SenderReceiverSelector'
import { PaymentMethodType } from '@/types/ride'
import { formatMoney } from '@/utils/formattedNumber'
import { RideFareInterface } from '@/interfaces/IRideFare'

interface DeliveryOptionsStepProps {
  scrollRef: React.RefObject<any>
  fareDetails: RideFareInterface | null
  distanceKm: number | undefined
  durationMinutes: number | undefined
  isLoadingRoute: boolean
}

const PAYMENT_OPTIONS: {
  key: PaymentMethodType
  label: string
  icon: React.ReactNode
}[] = [
  {
    key: 'cash',
    label: 'Dinheiro',
    icon: <Banknote size={18} color="currentColor" />
  },
  {
    key: 'card',
    label: 'Cartão',
    icon: <CreditCard size={18} color="currentColor" />
  },
  {
    key: 'wallet',
    label: 'Wallet',
    icon: <Wallet size={18} color="currentColor" />
  }
]

export const DeliveryOptionsStep = memo(function DeliveryOptionsStep({
  scrollRef,
  fareDetails,
  distanceKm,
  durationMinutes,
  isLoadingRoute
}: DeliveryOptionsStepProps) {
  const {
    articleType,
    setArticleType,
    paymentMethod,
    setPaymentMethod,
    senderIsSelf,
    setSenderIsSelf,
    receiverIsSelf,
    setReceiverIsSelf,
    sender,
    setSender,
    receiver,
    setReceiver,
    nextStep,
    prevStep
  } = useRideFlowStore()

  const { user } = useAuthStore()

  const [keyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    )
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    )
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  const articleSheetRef = useRef<BottomSheetModal>(null)

  const canProceed =
    (senderIsSelf || (sender.name !== '' && sender.phone !== '')) &&
    (receiverIsSelf || (receiver.name !== '' && receiver.phone !== ''))

  const handleOpenArticlePicker = useCallback(() => {
    articleSheetRef.current?.present()
  }, [])

  // Scroll the sheet after keyboard + snap animation finish (~450ms total)
  const handleFocusInput = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 450)
  }, [scrollRef])

  return (
    <>
      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: keyboardVisible ? 200 : 20
        }}
      >
        {/* Estimated Price Card */}
        <Animated.View
          entering={FadeInDown.delay(50).duration(400)}
          className="bg-primary-200 rounded-2xl p-5 mt-4 mb-5"
        >
          {isLoadingRoute ? (
            <View className="items-center py-2">
              <ActivityIndicator color="white" />
              <Text className="text-gray-400 text-sm mt-2">
                Calculando rota...
              </Text>
            </View>
          ) : (
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-white text-xs mb-1">Valor estimado</Text>
                <Text className="text-white text-3xl font-bold">
                  {formatMoney(fareDetails?.total ?? 0, 0)}
                </Text>
              </View>
              <View className="items-end justify-center gap-1">
                <View className="bg-white px-3 py-1.5 border border-white rounded-3xl">
                  <Text className="text-gray-800 text-xs">
                    {distanceKm != null
                      ? `${distanceKm.toFixed(1)} km`
                      : '-- km'}
                  </Text>
                </View>
                <View className="bg-white px-3 py-1.5 border border-white rounded-3xl">
                  <Text className="text-gray-800 text-xs">
                    {durationMinutes != null
                      ? `~${durationMinutes} min`
                      : '-- min'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Article Type */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          className="mb-5"
        >
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Tipo de Encomenda
          </Text>
          <TouchableOpacity
            onPress={handleOpenArticlePicker}
            activeOpacity={0.8}
            className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3.5 border border-gray-100"
          >
            <Package size={17} color="#6b7280" />
            <Text className="flex-1 text-gray-800 font-medium text-sm ml-3">
              {articleType}
            </Text>
            <ChevronRight size={16} color="#9ca3af" />
          </TouchableOpacity>
        </Animated.View>

        {/* Payment Method */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(400)}
          className="mb-5"
        >
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Forma de Pagamento
          </Text>
          <View className="flex-row gap-2">
            {PAYMENT_OPTIONS.map(opt => {
              const isSelected = paymentMethod === opt.key
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setPaymentMethod(opt.key)}
                  activeOpacity={0.8}
                  className={`flex-1 items-center py-3 rounded-xl border ${
                    isSelected
                      ? 'bg-white border-primary-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold mt-1 ${isSelected ? 'text-primary-200' : 'text-gray-600'}`}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </Animated.View>

        {/* Sender */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          className="mb-5"
        >
          <SenderReceiverSelector
            onFocusInput={handleFocusInput}
            label="Quem está a enviar?"
            isSelf={senderIsSelf}
            personInfo={sender}
            onToggleSelf={isSelf => setSenderIsSelf(isSelf, user ?? undefined)}
            onChangeName={name => setSender({ ...sender, name })}
            onChangePhone={phone => setSender({ ...sender, phone })}
          />
        </Animated.View>

        {/* Receiver */}
        <Animated.View
          entering={FadeInDown.delay(250).duration(400)}
          className="mb-6"
        >
          <SenderReceiverSelector
            onFocusInput={handleFocusInput}
            label="Quem está a receber?"
            isSelf={receiverIsSelf}
            personInfo={receiver}
            onToggleSelf={isSelf =>
              setReceiverIsSelf(isSelf, user ?? undefined)
            }
            onChangeName={name => setReceiver({ ...receiver, name })}
            onChangePhone={phone => setReceiver({ ...receiver, phone })}
          />
        </Animated.View>

        {/* Navigation Buttons */}
        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity
            onPress={prevStep}
            activeOpacity={0.8}
            className="flex-row items-center justify-center px-5 py-4 rounded-2xl border border-gray-200 bg-white"
          >
            <ArrowLeft size={18} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={nextStep}
            disabled={!canProceed}
            activeOpacity={0.85}
            className={`flex-1 flex-row items-center justify-center py-4 rounded-2xl ${
              canProceed ? 'bg-primary-200' : 'bg-gray-200'
            }`}
          >
            <Text
              className={`text-base font-bold mr-2 ${
                canProceed ? 'text-white' : 'text-gray-400'
              }`}
            >
              Próximo
            </Text>
            <ArrowRight size={18} color={canProceed ? 'white' : '#9ca3af'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Article Picker Sheet */}
      <ArticlePickerSheet
        ref={articleSheetRef}
        selected={articleType}
        onSelect={setArticleType}
      />
    </>
  )
})
