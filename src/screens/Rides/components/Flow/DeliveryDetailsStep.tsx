// src/screens/Rides/components/Flow/DeliveryDetailsStep.tsx
import React, { memo, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Platform, Keyboard } from 'react-native'
import {
  BottomSheetTextInput as TextInput,
  useBottomSheet
} from '@gorhom/bottom-sheet'
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  DoorOpen,
  Navigation
} from 'lucide-react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useRideFlowStore } from '@/storage/store/useRideFlowStore'
import { PickupOptionType } from '@/types/ride'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParamList } from '@/types/navigation'
import ROUTES from '@/constants/routes'
import { useAlert } from '@/context/AlertContext'
import { useNetwork } from '@/hooks/useNetwork'

interface PickupOptionCardProps {
  optionKey: PickupOptionType
  label: string
  subtitle: string
  icon: React.ReactNode
  isSelected: boolean
  onSelect: () => void
}

const PickupOptionCard = memo(function PickupOptionCard({
  label,
  subtitle,
  icon,
  isSelected,
  onSelect
}: PickupOptionCardProps) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.8}
      className={`flex-1 p-4 rounded-2xl border-2 ${
        isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-100 bg-white'
      }`}
    >
      <View className={`mb-2 ${isSelected ? 'opacity-100' : 'opacity-50'}`}>
        {icon}
      </View>
      <Text
        className={`font-bold text-sm mb-0.5 ${isSelected ? 'text-white' : 'text-gray-800'}`}
      >
        {label}
      </Text>
      <Text
        className={`text-xs ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}
      >
        {subtitle}
      </Text>
    </TouchableOpacity>
  )
})

interface DeliveryDetailsStepProps {
  scrollRef: React.RefObject<any>
}

export const DeliveryDetailsStep = memo(function DeliveryDetailsStep({
  scrollRef
}: DeliveryDetailsStepProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>()
  const { showAlert } = useAlert()
  const { isConnected } = useNetwork()
  const { snapToIndex } = useBottomSheet()

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

  const {
    pickup,
    dropoff,
    sender,
    receiver,
    articleType,
    description,
    setDescription,
    driverInstructions,
    setDriverInstructions,
    pickupOption,
    setPickupOption,
    paymentMethod,
    prevStep,
    reset
  } = useRideFlowStore()

  const handleConfirm = () => {
    if (!isConnected) {
      showAlert(
        'Sem ligação',
        'Verifica a tua conexão à internet para solicitar a entrega.',
        'warning'
      )
      return
    }

    if (!pickup || !dropoff) {
      showAlert('Erro', 'Localizações inválidas. Volta ao início.', 'error')
      return
    }

    navigation.navigate(ROUTES.Rides.SUMMARY, {
      location: { pickup, dropoff },
      receiver: { name: receiver.name, phone: receiver.phone },
      article: { type: articleType, description },
      sender: { name: sender.name, phone: sender.phone },
      pickupOption,
      paymentMethod,
      driverInstructions
    })
  }

  // Expand to max snap + scroll to end after keyboard appears
  const handleInputFocus = () => {
    snapToIndex(2) // 85% — maximum for step 3
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 400)
  }

  return (
    // Plain View — scroll handled by BottomSheetScrollView in RideFlowBottomSheet
    <View
      style={{
        paddingHorizontal: 20,
        marginBottom: keyboardVisible ? 200 : 20
      }}
    >
      {/* Description */}
      <Animated.View
        entering={FadeInDown.delay(50).duration(400)}
        className="mt-4 mb-5"
      >
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Descrição da encomenda
        </Text>
        <View className="flex-row bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 h-20">
          <FileText size={17} color="#9ca3af" className="mt-0.5" />
          <TextInput
            placeholder="O que estamos a levar? Dê detalhes..."
            value={description}
            onChangeText={setDescription}
            multiline
            className="flex-1 text-gray-800 font-medium ml-3 p-0"
            style={{ textAlignVertical: 'top', paddingTop: 0 }}
            placeholderTextColor="#9ca3af"
            onFocus={handleInputFocus}
          />
        </View>
      </Animated.View>

      {/* Driver Instructions (optional) */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        className="mb-5"
      >
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Instruções para o motorista{' '}
          <Text className="text-gray-400 font-normal">(opcional)</Text>
        </Text>

        <View className="flex-row bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 h-20">
          <MessageSquare size={17} color="#9ca3af" />
          <TextInput
            placeholder='Ex: "Ligar antes de chegar"'
            value={driverInstructions}
            onChangeText={setDriverInstructions}
            multiline
            onFocus={handleInputFocus}
            className="flex-1 text-gray-800 font-medium ml-3 p-0"
            style={{ textAlignVertical: 'top', paddingTop: 0 }}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </Animated.View>

      {/* Pickup Option */}
      <Animated.View
        entering={FadeInDown.delay(150).duration(400)}
        className="mb-6"
      >
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Como o motorista deve encontrar o remetente?
        </Text>
        <View className="flex-row gap-3">
          <PickupOptionCard
            optionKey="door"
            label="Entrega na porta"
            subtitle="Inclua instruções adicionais para chegar até você"
            icon={
              <DoorOpen
                size={22}
                color={pickupOption === 'door' ? 'white' : '#374151'}
              />
            }
            isSelected={pickupOption === 'door'}
            onSelect={() => setPickupOption('door')}
          />
          <PickupOptionCard
            optionKey="curb"
            label="No ponto do mapa"
            subtitle="Encontro no ponto indicado (rua ou local acessível)"
            icon={
              <Navigation
                size={22}
                color={pickupOption === 'curb' ? 'white' : '#374151'}
              />
            }
            isSelected={pickupOption === 'curb'}
            onSelect={() => setPickupOption('curb')}
          />
        </View>
      </Animated.View>

      {/* Navigation Buttons */}
      <View className="flex-row gap-3 mb-4">
        <TouchableOpacity
          onPress={prevStep}
          activeOpacity={0.8}
          className="items-center justify-center px-5 py-4 rounded-2xl border border-gray-200 bg-white"
        >
          <ArrowLeft size={18} color="#374151" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleConfirm}
          activeOpacity={0.85}
          className="flex-1 items-center justify-center py-4 rounded-2xl bg-primary-200"
        >
          <Text className="text-base font-bold text-white">
            Confirmar Entrega
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
})
