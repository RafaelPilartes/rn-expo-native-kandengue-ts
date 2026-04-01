import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInDown
} from 'react-native-reanimated'
import {
  Navigation,
  Crosshair,
  ArrowLeft,
  User,
  Phone,
  Package,
  FileText,
  ArrowRight
} from 'lucide-react-native'

import ROUTES from '@/constants/routes'
import { GOOGLE_API_KEY } from '@/constants/keys'
import { CustomPlace } from '@/types/places'
import { HomeStackParamList } from '@/types/navigation'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { ArticleOptions } from '@/constants/article'
import { useAlert } from '@/context/AlertContext'
import { useNetwork } from '@/hooks/useNetwork'
import { useLocation } from '@/context/LocationContext'
import { getAddressFromCoords } from '@/services/google/googleApi'

export default function RideChooseScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>()
  const insets = useSafeAreaInsets()

  const { requestCurrentLocation } = useLocation()

  const { isConnected } = useNetwork()

  const [pickup, setPickup] = useState<CustomPlace | null>(null)
  const [dropoff, setDropoff] = useState<CustomPlace | null>(null)

  // Independent loading state for each location button
  const [loadingPickupLocation, setLoadingPickupLocation] = useState(false)
  const [loadingDropoffLocation, setLoadingDropoffLocation] = useState(false)

  // -- LOGIC FROM WORKING VERSION --
  const [showPickupList, setShowPickupList] = useState(false)
  const [showDropoffList, setShowDropoffList] = useState(false)

  // UI States (for border coloring)
  const [activeInput, setActiveInput] = useState<'pickup' | 'dropoff' | null>(
    null
  )

  const [showDetails, setShowDetails] = useState(false)

  // Form Data
  const [receiverName, setReceiverName] = useState('')
  const [receiverPhone, setReceiverPhone] = useState('')
  const [articleType, setArticleType] = useState('Documentos')
  const [description, setDescription] = useState('')

  const { showAlert } = useAlert()

  // Refs
  const pickupRef = useRef<any>(null)
  const dropoffRef = useRef<any>(null)
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    if (dropoff) {
      setShowDetails(true)
    }
  }, [dropoff])

  const fetchCurrentLocationFor = async (target: 'pickup' | 'dropoff') => {
    const setLoading =
      target === 'pickup' ? setLoadingPickupLocation : setLoadingDropoffLocation
    const setter = target === 'pickup' ? setPickup : setDropoff
    const ref = target === 'pickup' ? pickupRef : dropoffRef

    setLoading(true)
    try {
      const coords = await requestCurrentLocation()
      if (!coords) return

      // Reverse geocode to get real place_id, name, and address
      const result = await getAddressFromCoords(
        coords.latitude,
        coords.longitude
      )

      let description = `${coords.latitude}, ${coords.longitude}`
      let placeId = `current_${target}_${Date.now()}`
      let name = 'Minha Localização'

      if (typeof result !== 'string') {
        description = result.addr || description
        placeId = result.placeId || placeId
        name = result.district || result.shortAddr || name
      }

      const currentPlace: CustomPlace = {
        description,
        place_id: placeId,
        name,
        latitude: coords.latitude,
        longitude: coords.longitude
      }

      setter(currentPlace)
      ref.current?.setAddressText(currentPlace.description)

      // Auto-focus next field if pickup
      if (target === 'pickup') {
        setTimeout(() => dropoffRef.current?.focus(), 300)
      }
    } catch (error) {
      console.error(`Erro ao obter localização para ${target}:`, error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlace = (
    data: any,
    details: any | null,
    setter: React.Dispatch<React.SetStateAction<CustomPlace | null>>,
    setShowList: React.Dispatch<React.SetStateAction<boolean>>,
    nextFieldFocus?: () => void
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
      setShowList(false)
      setActiveInput(null)
      Keyboard.dismiss()

      if (nextFieldFocus) {
        // Optional: auto-focus next field
        setTimeout(nextFieldFocus, 300)
      }
    }
  }

  const handleConfirm = () => {
    if (!isConnected) {
      showAlert(
        'Atenção',
        'Por favor, verifique sua conexão com a internet para poder solicitar uma entrega',
        'warning'
      )
      return
    }

    // Debug: Check each field individually
    console.log('📍 Validation checks:', {
      hasPickup: !!pickup,
      hasDropoff: !!dropoff,
      hasReceiverName: !!receiverName,
      hasReceiverPhone: !!receiverPhone,
      pickupValue: pickup,
      dropoffValue: dropoff,
      receiverNameValue: receiverName,
      receiverPhoneValue: receiverPhone
    })

    if (!pickup || !dropoff || !receiverName || !receiverPhone) {
      showAlert(
        'Dados inválidos',
        'Por favor, preencha todos os campos obrigatórios.'
      )
      return
    }

    console.log('✅ handleConfirm - All validations passed')
    navigation.navigate(ROUTES.Rides.SUMMARY, {
      location: { pickup, dropoff },
      receiver: { name: receiverName, phone: receiverPhone },
      article: { type: articleType, description }
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View className="px-5 pb-4 flex-row items-center z-10 bg-gray-50">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm mr-4"
          >
            <ArrowLeft size={20} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Nova Entrega</Text>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <FlatList
              ref={flatListRef}
              data={[]}
              renderItem={null}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 280 }}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View className="flex-1 px-5 pt-2">
                  {/* Route Card */}
                  <Animated.View
                    entering={FadeInDown.delay(100).duration(500)}
                    className="bg-white rounded-3xl p-5 shadow-sm shadow-gray-200 mb-6"
                    style={{ zIndex: 50 }} // Ensure list floats above
                  >
                    <View className="flex-col">
                      {/* Pickup Row */}
                      <View
                        className="flex-row relative"
                        style={{ zIndex: 100 }}
                      >
                        <View className="items-center mr-4 mt-8 w-4 relative z-10">
                          <View className="w-4 h-4 rounded-full bg-white border-4 border-green-500 shadow-sm" />
                        </View>
                        {/* Connecting Line */}
                        <View className="absolute top-[44px] left-[7px] w-[2px] bg-gray-200 z-0 bottom-0" />

                        <View className="flex-1 pb-4">
                          {/* Pickup Input */}
                          <View className="flex-row items-center justify-between mb-1 ml-1 mr-1">
                            <Text className="text-xs font-medium text-gray-400">
                              DE ONDE?
                            </Text>
                            <TouchableOpacity
                              onPress={() => fetchCurrentLocationFor('pickup')}
                              disabled={loadingPickupLocation}
                              className="flex-row items-center px-2 py-1 rounded-lg bg-green-50 active:bg-green-100"
                            >
                              {loadingPickupLocation ? (
                                <ActivityIndicator size={12} color="#10b981" />
                              ) : (
                                <Crosshair size={12} color="#10b981" />
                              )}
                              <Text className="text-[11px] font-semibold text-green-600 ml-1">
                                Minha localização
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View
                            className={`bg-gray-50 rounded-xl border ${activeInput === 'pickup' ? 'border-green-500 bg-white' : 'border-gray-100'}`}
                          >
                            <GooglePlacesAutocomplete
                              ref={pickupRef}
                              placeholder="Local de coleta"
                              onPress={(data, details = null) =>
                                handleSelectPlace(
                                  data,
                                  details,
                                  setPickup,
                                  setShowPickupList,
                                  () => dropoffRef.current?.focus()
                                )
                              }
                              query={{
                                key: GOOGLE_API_KEY,
                                language: 'pt-BR',
                                components: 'country:ao'
                              }}
                              fetchDetails={true}
                              styles={cleanGoogleStyles}
                              textInputProps={{
                                onFocus: () => {
                                  setActiveInput('pickup')
                                  setShowPickupList(true)
                                },
                                onBlur: () => {
                                  setActiveInput(null)
                                  setShowPickupList(false)
                                },
                                placeholderTextColor: '#9ca3af'
                              }}
                              enablePoweredByContainer={false}
                              debounce={300}
                              listViewDisplayed={showPickupList}
                              onTimeout={() => setShowPickupList(false)}
                            />
                          </View>
                        </View>
                      </View>

                      {/* Dropoff Row */}
                      <View
                        className="flex-row relative"
                        style={{ zIndex: 90 }}
                      >
                        <View className="items-center mr-4 mt-8 w-4 relative z-10">
                          <View className="w-4 h-4 rounded-sm bg-white border-4 border-red-500 shadow-sm" />
                        </View>

                        <View className="flex-1">
                          {/* Dropoff Input */}
                          <View className="flex-row items-center justify-between mb-1 ml-1 mr-1">
                            <Text className="text-xs font-medium text-gray-400">
                              PARA ONDE?
                            </Text>
                            <TouchableOpacity
                              onPress={() => fetchCurrentLocationFor('dropoff')}
                              disabled={loadingDropoffLocation}
                              className="flex-row items-center px-2 py-1 rounded-lg bg-red-50 active:bg-red-100"
                            >
                              {loadingDropoffLocation ? (
                                <ActivityIndicator size={12} color="#ef4444" />
                              ) : (
                                <Crosshair size={12} color="#ef4444" />
                              )}
                              <Text className="text-[11px] font-semibold text-red-500 ml-1">
                                Minha localização
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View
                            className={`bg-gray-50 rounded-xl border ${activeInput === 'dropoff' ? 'border-red-500 bg-white' : 'border-gray-100'}`}
                          >
                            <GooglePlacesAutocomplete
                              ref={dropoffRef}
                              placeholder="Local de entrega"
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
                                components: 'country:ao'
                              }}
                              fetchDetails={true}
                              styles={cleanGoogleStyles}
                              textInputProps={{
                                onFocus: () => {
                                  setActiveInput('dropoff')
                                  setShowDropoffList(true)
                                },
                                onBlur: () => {
                                  setActiveInput(null)
                                  setShowDropoffList(false)
                                },
                                placeholderTextColor: '#9ca3af'
                              }}
                              enablePoweredByContainer={false}
                              debounce={300}
                              listViewDisplayed={showDropoffList}
                              onTimeout={() => setShowDropoffList(false)}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </Animated.View>

                  {/* Details Section (Appears after dropoff selected) */}
                  {showDetails && (
                    <Animated.View
                      entering={FadeInUp.springify().damping(15)}
                      className="gap-4"
                      style={{ zIndex: 10 }} // Lower zIndex
                    >
                      {/* Receiver Info */}
                      <View className="bg-white rounded-3xl p-5 shadow-sm shadow-gray-200">
                        <View className="flex-row items-center mb-4">
                          <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3">
                            <User size={16} color="#3b82f6" />
                          </View>
                          <Text className="text-base font-bold text-gray-800">
                            Destinatário
                          </Text>
                        </View>

                        <View className="gap-3">
                          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                            <User size={18} color="#9ca3af" className="mr-3" />
                            <TextInput
                              placeholder="Nome completo"
                              value={receiverName}
                              onChangeText={setReceiverName}
                              className="flex-1 text-gray-800 font-medium"
                              placeholderTextColor="#9ca3af"
                            />
                          </View>
                          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                            <Phone size={18} color="#9ca3af" className="mr-3" />
                            <TextInput
                              placeholder="Telefone"
                              value={receiverPhone}
                              onChangeText={setReceiverPhone}
                              keyboardType="phone-pad"
                              className="flex-1 text-gray-800 font-medium"
                              placeholderTextColor="#9ca3af"
                            />
                          </View>
                        </View>
                      </View>

                      {/* Package Info */}
                      <View className="bg-white rounded-3xl p-5 shadow-sm shadow-gray-200">
                        <View className="flex-row items-center mb-4">
                          <View className="w-8 h-8 rounded-full bg-orange-50 items-center justify-center mr-3">
                            <Package size={16} color="#f97316" />
                          </View>
                          <Text className="text-base font-bold text-gray-800">
                            Encomenda
                          </Text>
                        </View>

                        <View className="gap-3">
                          {/* Article Type Selector (Simple Horizontal Scroll) */}
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="mb-2"
                          >
                            {ArticleOptions.map(opt => (
                              <TouchableOpacity
                                key={opt.value}
                                onPress={() => setArticleType(opt.value)}
                                className={`mr-2 px-4 py-2 rounded-full border ${articleType === opt.value ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'}`}
                              >
                                <Text
                                  className={`font-medium ${articleType === opt.value ? 'text-white' : 'text-gray-600'}`}
                                >
                                  {opt.label}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>

                          <View className="flex-row bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 h-24">
                            <FileText
                              size={18}
                              color="#9ca3af"
                              className="mr-3 mt-1"
                            />
                            <TextInput
                              placeholder="O que estamos levando? (Detalhes)"
                              value={description}
                              onChangeText={setDescription}
                              multiline
                              className="flex-1 text-gray-800 font-medium p-0 m-0"
                              style={{ paddingTop: 0, paddingBottom: 0, textAlignVertical: 'top', height: '100%' }}
                              placeholderTextColor="#9ca3af"
                              onFocus={() => {
                                setTimeout(() => {
                                  flatListRef.current?.scrollToEnd({
                                    animated: true
                                  })
                                }, 300)
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    </Animated.View>
                  )}
                </View>
              }
            />
          </TouchableWithoutFeedback>
        </TouchableWithoutFeedback>

        {/* Floating Confirm Bar */}
        <Animated.View
          entering={SlideInDown.duration(400)}
          className="absolute bottom-0 left-0 right-0 bg-white px-5 pt-4 border-t border-gray-100 rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
          style={{
            elevation: 10,
            paddingBottom: Math.max(insets.bottom + 16, 28)
          }}
        >
          <TouchableOpacity
            onPress={handleConfirm}
            className={`w-full py-4 rounded-2xl items-center flex-row justify-center bg-primary-200 `}
          >
            <Text className={`text-lg font-bold mr-2 text-white`}>
              Confirmar Pedido
            </Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const cleanGoogleStyles = {
  container: {
    flex: 0,
    marginBottom: 1
  },
  textInputContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  textInput: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
    height: 48,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  },
  listView: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 16,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1000
  },
  row: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb'
  },
  description: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '400'
  }
}
