import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
  FlatList
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import axios from 'axios'

import ROUTES from '@/constants/routes'
import { BackButton } from '@/components/ui/button/BackButton'
import { GOOGLE_API_KEY } from '@/constants/keys'
import PrimaryButton from '@/components/ui/button/PrimaryButton'
import { CustomPlace } from '@/types/places'
import { HomeStackParamList } from '@/types/navigation'
import { InputField } from '@/components/ui/input/InputField'
import { SelectField } from '@/components/ui/select/SelectField'
import { InputTextAreaField } from '@/components/ui/input/InputTextAreaField'
import { ArticleOptions } from '@/constants/article'
import { useLocation } from '@/hooks/useLocation'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { MapPin, Navigation } from 'lucide-react-native'

export default function RideChooseScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>()

  const {
    location,
    isLoading,
    requestCurrentLocation,
    error: locationError,
    address,
    fullAddress,
    isGettingAddress
  } = useLocation()

  const [pickup, setPickup] = useState<CustomPlace | null>(null)
  const [dropoff, setDropoff] = useState<CustomPlace | null>(null)

  const [showPickupList, setShowPickupList] = useState(false)
  const [showDropoffList, setShowDropoffList] = useState(false)

  // Refs para controlar os componentes
  const pickupRef = useRef<any>(null)
  const dropoffRef = useRef<any>(null)

  // Novos campos
  const [receiverName, setReceiverName] = useState('')
  const [receiverPhone, setReceiverPhone] = useState('')
  const [articleType, setArticleType] = useState('Documentos')
  const [description, setDescription] = useState('')

  const fetchCurrentLocation = async () => {
    try {
      await requestCurrentLocation()

      if (location && address) {
        const currentPlace: CustomPlace = {
          description: address,
          place_id: `current_location_${Date.now()}`,
          name: 'Minha Localização',
          latitude: location.latitude,
          longitude: location.longitude
        }

        setPickup(currentPlace)

        // Preencher o input com o endereço atual
        if (pickupRef.current) {
          pickupRef.current.setAddressText(address)
        }
      }
    } catch (error) {
      console.error('Erro ao obter localização atual:', error)
    }
  }

  const handleSelectPlace = async (
    data: any,
    details: any | null,
    setter: React.Dispatch<React.SetStateAction<CustomPlace | null>>,
    setShowList: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (details) {
      const { lat, lng } = details.geometry.location
      const place: CustomPlace = {
        description: data.description,
        place_id: data.place_id,
        name: data.structured_formatting.main_text,
        latitude: lat,
        longitude: lng
      }
      setter(place)

      // Fecha a lista de sugestões
      setShowList(false)

      // Esconde o teclado
      Keyboard.dismiss()
    }
  }

  const handleConfirm = () => {
    if (!pickup || !dropoff || !receiverName || !receiverPhone) return

    console.log('Confirma entrega:', {
      pickup,
      dropoff,
      receiverName,
      receiverPhone,
      articleType,
      description
    })

    navigation.navigate(ROUTES.Rides.SUMMARY, {
      location: { pickup, dropoff },
      receiver: { name: receiverName, phone: receiverPhone },
      article: { type: articleType, description }
    })
  }

  const clearPickup = () => {
    setPickup(null)
    if (pickupRef.current) {
      pickupRef.current.setAddressText('')
    }
  }

  const clearDropoff = () => {
    setDropoff(null)
    if (dropoffRef.current) {
      dropoffRef.current.setAddressText('')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <BackButton className="mr-3" iconColor="black" />
        <Text className="text-2xl font-semibold text-gray-800">
          Solicitar Entrega
        </Text>
        <View className="w-8" />
      </View>

      {/* Conteúdo */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={[]}
            renderItem={null}
            ListHeaderComponent={
              <View className="flex-1 px-5 py-6">
                {/* Detalhes de coleta */}
                <View className="flex-col">
                  <Text className="w-full text-base font-semibold py-2 px-4 mb-3 text-gray-600 bg-gray-200 rounded-lg">
                    Detalhes de coleta
                  </Text>

                  {/* Input Coleta */}
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                      Endereço de Coleta
                    </Text>

                    <GooglePlacesAutocomplete
                      ref={pickupRef}
                      placeholder="Digite o local de coleta"
                      onPress={(data, details = null) =>
                        handleSelectPlace(
                          data,
                          details,
                          setPickup,
                          setShowPickupList
                        )
                      }
                      query={{
                        key: GOOGLE_API_KEY,
                        language: 'pt-BR',
                        components: 'country:ao' // Angola
                      }}
                      fetchDetails={true}
                      styles={googleStyles}
                      textInputProps={{
                        placeholderTextColor: '#9ca3af',
                        clearButtonMode: 'while-editing',
                        onFocus: () => setShowPickupList(true),
                        onBlur: () => setShowPickupList(false)
                      }}
                      enablePoweredByContainer={false}
                      debounce={300}
                      listViewDisplayed={showPickupList}
                      // Fechar lista quando texto estiver vazio
                      onTimeout={() => setShowPickupList(false)}
                    />

                    {/* Localização atual */}
                    <TouchableWithoutFeedback onPress={fetchCurrentLocation}>
                      <View className="flex-row items-center mt-2">
                        {isLoading ? (
                          <>
                            <ActivityIndicator size="small" color="#3b82f6" />
                            <Text className="ml-2 text-blue-600 text-sm">
                              Buscando localização...
                            </Text>
                          </>
                        ) : (
                          <>
                            <Navigation size={16} color="#3b82f6" />
                            <Text className="ml-2 text-blue-600 text-sm font-medium">
                              Usar minha localização atual
                            </Text>
                          </>
                        )}
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>

                {/* Detalhes de entrega */}
                <View className="flex-col">
                  <Text className="w-full text-base font-semibold py-2 px-4 mb-3 text-gray-600 bg-gray-200 rounded-lg">
                    Detalhes de entrega
                  </Text>

                  {/* Input Entrega */}
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                      Endereço de Entrega
                    </Text>

                    <GooglePlacesAutocomplete
                      ref={dropoffRef}
                      placeholder="Digite o local de entrega"
                      onPress={(data, details = null) =>
                        handleSelectPlace(
                          data,
                          details,
                          setDropoff,
                          setShowDropoffList
                        )
                      }
                      query={{
                        key: GOOGLE_API_KEY,
                        language: 'pt-BR',
                        components: 'country:ao' // Angola
                      }}
                      fetchDetails={true}
                      styles={googleStyles}
                      textInputProps={{
                        placeholderTextColor: '#9ca3af',
                        clearButtonMode: 'while-editing',
                        onFocus: () => setShowDropoffList(true),
                        onBlur: () => setShowDropoffList(false)
                      }}
                      enablePoweredByContainer={false}
                      debounce={300}
                      listViewDisplayed={showDropoffList}
                      // Fechar lista quando texto estiver vazio
                      onTimeout={() => setShowDropoffList(false)}
                    />
                  </View>

                  {/* Nome e telefone do receptor */}
                  <View className="w-full flex-row justify-between gap-2 mb-4">
                    {/* Nome do receptor */}
                    <View className="flex-1">
                      <InputField
                        label={'Nome do Receptor'}
                        value={receiverName}
                        onChangeText={setReceiverName}
                        placeholder={'Digite o nome'}
                      />
                    </View>

                    {/* Número do receptor */}
                    <View className="flex-1">
                      <InputField
                        label={'Número do Receptor'}
                        value={receiverPhone}
                        onChangeText={setReceiverPhone}
                        keyboardType="phone-pad"
                        placeholder={'Digite o número'}
                      />
                    </View>
                  </View>

                  {/* Tipo de artigo */}
                  <View className="mb-4">
                    <SelectField
                      label="Tipo de artigo"
                      placeholder="Selecione o tipo de artigo"
                      value={articleType}
                      onSelect={setArticleType}
                      options={ArticleOptions}
                    />
                  </View>

                  {/* Descrição */}
                  <View className="mb-4">
                    <InputTextAreaField
                      label="Detalhes do artigo"
                      placeholder="Escreva aqui detalhes do artigo..."
                      value={description}
                      onChangeText={setDescription}
                    />
                  </View>
                </View>
              </View>
            }
            keyboardShouldPersistTaps="handled"
          />
        </TouchableWithoutFeedback>

        {/* Botão Confirmar */}
        <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-200">
          <PrimaryButton
            disabled={!pickup || !dropoff || !receiverName || !receiverPhone}
            label={'Confirmar Entrega'}
            onPress={handleConfirm}
          />

          {/* Resumo da entrega */}
          {(pickup || dropoff) && (
            <View className="mt-3 p-3 bg-gray-50 rounded-lg">
              <Text className="text-gray-700 text-sm font-medium mb-2">
                Resumo da Entrega:
              </Text>
              {pickup && (
                <Text className="text-gray-600 text-xs">
                  📍 <Text className="font-medium">De:</Text> {pickup.name}
                </Text>
              )}
              {dropoff && (
                <Text className="text-gray-600 text-xs mt-1">
                  🎯 <Text className="font-medium">Para:</Text> {dropoff.name}
                </Text>
              )}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const googleStyles = {
  container: {
    flex: 0,
    marginBottom: 1
  },
  textInputContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    height: 48
  },
  listView: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginTop: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  row: {
    backgroundColor: '#fff',
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  description: {
    fontSize: 14,
    color: '#374151'
  },
  poweredContainer: {
    display: 'none'
  }
}
