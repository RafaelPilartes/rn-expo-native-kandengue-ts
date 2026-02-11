import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInDown
} from 'react-native-reanimated'
import {
  Navigation,
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
import { useMap } from '@/providers/MapProvider'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { ArticleOptions } from '@/constants/article'
import { useAlert } from '@/context/AlertContext'

export default function RideChooseScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>()

  const {
    location,
    isLoading,
    getCurrentLocation: requestCurrentLocation,
    address
  } = useMap()

  const [pickup, setPickup] = useState<CustomPlace | null>(null)
  const [dropoff, setDropoff] = useState<CustomPlace | null>(null)

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

  useEffect(() => {
    if (dropoff) {
      setShowDetails(true)
    }
  }, [dropoff])

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
        pickupRef.current?.setAddressText(address)
      }
    } catch (error) {
      console.error('Erro ao obter localização atual:', error)
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
    if (!pickup || !dropoff || !receiverName || !receiverPhone) {
      showAlert(
        'Dados inválidos',
        'Por favor, preencha todos os campos obrigatórios.'
      )
      return
    }

    navigation.navigate(ROUTES.Rides.SUMMARY, {
      location: { pickup, dropoff },
      receiver: { name: receiverName, phone: receiverPhone },
      article: { type: articleType, description }
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 py-safe">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
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
          <FlatList
            data={[]}
            renderItem={null}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View className="flex-1 px-5 pt-2">
                {/* Route Card */}
                <Animated.View
                  entering={FadeInDown.delay(100).duration(500)}
                  className="bg-white rounded-3xl p-5 shadow-sm shadow-gray-200 mb-6"
                  style={{ zIndex: 50 }} // Ensure list floats above
                >
                  <View className="flex-row">
                    {/* Visual Route Line */}
                    <View className="items-center mr-4 mt-4">
                      <View className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-100" />
                      <View className="w-[2px] h-12 bg-gray-200 my-1" />
                      <View className="w-3 h-3 bg-red-500 rounded-sm ring-4 ring-red-100" />
                    </View>

                    {/* Inputs Container */}
                    <View className="flex-1 gap-4">
                      {/* Pickup Input */}
                      <View className="relative" style={{ zIndex: 100 }}>
                        <Text className="text-xs font-medium text-gray-400 mb-1 ml-1">
                          DE ONDE?
                        </Text>
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
                          {/* Current Location Quick Action */}
                          {!pickup && activeInput === 'pickup' && (
                            <TouchableOpacity
                              onPress={fetchCurrentLocation}
                              className="absolute right-3 top-3"
                            >
                              {isLoading ? (
                                <ActivityIndicator
                                  size="small"
                                  color="#10b981"
                                />
                              ) : (
                                <Navigation size={18} color="#10b981" />
                              )}
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>

                      {/* Dropoff Input */}
                      <View className="relative" style={{ zIndex: 90 }}>
                        <Text className="text-xs font-medium text-gray-400 mb-1 ml-1">
                          PARA ONDE?
                        </Text>
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

                        <View className="flex-row items-start bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 h-24">
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
                            className="flex-1 text-gray-800 font-medium leading-5"
                            placeholderTextColor="#9ca3af"
                            textAlignVertical="top"
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

        {/* Floating Confirm Bar */}
        <Animated.View
          entering={SlideInDown.duration(400)}
          className="absolute bottom-0 left-0 right-0 bg-white px-5 pt-4 pb-8 border-t border-gray-100 rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
          style={{ elevation: 10 }}
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
