// src/screens/Rides/components/Flow/RouteInputStep.tsx
import React, { useRef, useState, useCallback, memo } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native'
import { Crosshair, ArrowRight, MapPin } from 'lucide-react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { useBottomSheet } from '@gorhom/bottom-sheet'
import { GOOGLE_API_KEY } from '@/constants/keys'
import { CustomPlace } from '@/types/places'
import { useRideFlowStore } from '@/storage/store/useRideFlowStore'
import { useLocation } from '@/context/LocationContext'
import { getAddressFromCoords } from '@/services/google/googleApi'

const cleanGoogleStyles = {
  container: { flex: 0 },
  textInputContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  textInput: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 15,
    color: '#111827',
    fontWeight: '500' as const,
    height: 40,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  listView: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 16,
    marginTop: 4,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    position: 'absolute' as const,
    top: 44,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  row: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  description: { fontSize: 14, color: '#374151' },
}

export const RouteInputStep = memo(function RouteInputStep() {
  const { pickup, dropoff, setPickup, setDropoff, nextStep } = useRideFlowStore()
  const { requestCurrentLocation } = useLocation()
  
  // Aceder aos métodos do BottomSheet pai
  const { expand } = useBottomSheet()

  const pickupRef = useRef<any>(null)
  const dropoffRef = useRef<any>(null)

  const [activeInput, setActiveInput] = useState<'pickup' | 'dropoff' | null>(null)
  const [showPickupList, setShowPickupList] = useState(false)
  const [showDropoffList, setShowDropoffList] = useState(false)
  const [loadingPickup, setLoadingPickup] = useState(false)
  const [loadingDropoff, setLoadingDropoff] = useState(false)

  const canProceed = pickup !== null && dropoff !== null

  const fetchCurrentLocationFor = useCallback(
    async (target: 'pickup' | 'dropoff') => {
      const setLoading = target === 'pickup' ? setLoadingPickup : setLoadingDropoff
      const setter = target === 'pickup' ? setPickup : setDropoff
      const ref = target === 'pickup' ? pickupRef : dropoffRef

      setLoading(true)
      try {
        const coords = await requestCurrentLocation()
        if (!coords) return

        const result = await getAddressFromCoords(coords.latitude, coords.longitude)

        let description = `${coords.latitude}, ${coords.longitude}`
        let placeId = `current_${target}_${Date.now()}`
        let name = 'Minha Localização'

        if (typeof result !== 'string') {
          description = result.addr || description
          placeId = result.placeId || placeId
          name = result.district || result.shortAddr || name
        }

        const place: CustomPlace = {
          description,
          place_id: placeId,
          name,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }

        setter(place)
        ref.current?.setAddressText(place.description)

        if (target === 'pickup') {
          setTimeout(() => dropoffRef.current?.focus(), 300)
        }
      } catch (err) {
        console.error(`Erro ao obter localização para ${target}:`, err)
      } finally {
        setLoading(false)
      }
    },
    [requestCurrentLocation, setPickup, setDropoff]
  )

  const handleSelectPlace = useCallback(
    (
      data: any,
      details: any,
      setter: (p: CustomPlace | null) => void,
      setShowList: (v: boolean) => void,
      nextFocus?: () => void
    ) => {
      if (!details) return
      const { lat, lng } = details.geometry.location
      const place: CustomPlace = {
        description: data.description,
        place_id: data.place_id,
        name: data.structured_formatting.main_text,
        latitude: lat,
        longitude: lng,
      }
      setter(place)
      setShowList(false)
      setActiveInput(null)
      Keyboard.dismiss()
      if (nextFocus) setTimeout(nextFocus, 300)
    },
    []
  )

  return (
    <View className="flex-1 px-5 pt-4 pb-6">
      {/* Title */}
      <Text className="text-xl font-bold text-gray-900 mb-5">
        Para onde vai a encomenda?
      </Text>

      {/* Route Card */}
      <View
        className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
        style={{ zIndex: 50 }}
      >
        {/* --- PICKUP --- */}
        <View className="flex-row" style={{ zIndex: 100 }}>
          {/* Icon + Line */}
          <View className="items-center mr-3 pt-2">
            <View className="w-3 h-3 rounded-full bg-green-500" />
            <View className="w-px flex-1 bg-gray-200 my-1" />
          </View>

          <View className="flex-1 pb-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                De onde?
              </Text>
              <TouchableOpacity
                onPress={() => fetchCurrentLocationFor('pickup')}
                disabled={loadingPickup}
                className="flex-row items-center px-2 py-1 rounded-lg bg-green-50"
                activeOpacity={0.7}
              >
                {loadingPickup ? (
                  <ActivityIndicator size={11} color="#10b981" />
                ) : (
                  <Crosshair size={11} color="#10b981" />
                )}
                <Text className="text-[11px] font-semibold text-green-600 ml-1">
                  Minha localização
                </Text>
              </TouchableOpacity>
            </View>

            <View
              className={`bg-white rounded-xl border px-3 ${
                activeInput === 'pickup' ? 'border-green-400' : 'border-gray-100'
              }`}
            >
              <GooglePlacesAutocomplete
                ref={pickupRef}
                placeholder="Local de recolha"
                onPress={(data, details = null) =>
                  handleSelectPlace(data, details, setPickup, setShowPickupList, () =>
                    dropoffRef.current?.focus()
                  )
                }
                query={{ key: GOOGLE_API_KEY, language: 'pt-BR', components: 'country:ao' }}
                fetchDetails
                styles={cleanGoogleStyles}
                textInputProps={{
                  onFocus: () => { 
                    expand() // Força o BottomSheet a subir para 85%
                    setActiveInput('pickup')
                    setShowPickupList(true) 
                  },
                  onBlur: () => { setActiveInput(null); setShowPickupList(false) },
                  placeholderTextColor: '#9ca3af',
                }}
                enablePoweredByContainer={false}
                debounce={300}
                listViewDisplayed={showPickupList}
                onTimeout={() => setShowPickupList(false)}
              />
            </View>
          </View>
        </View>

        {/* --- DROPOFF --- */}
        <View className="flex-row" style={{ zIndex: 90 }}>
          <View className="items-center mr-3 pt-2">
            <View className="w-3 h-3 rounded-sm bg-red-500" />
          </View>

          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                Para onde?
              </Text>
              <TouchableOpacity
                onPress={() => fetchCurrentLocationFor('dropoff')}
                disabled={loadingDropoff}
                className="flex-row items-center px-2 py-1 rounded-lg bg-red-50"
                activeOpacity={0.7}
              >
                {loadingDropoff ? (
                  <ActivityIndicator size={11} color="#ef4444" />
                ) : (
                  <Crosshair size={11} color="#ef4444" />
                )}
                <Text className="text-[11px] font-semibold text-red-500 ml-1">
                  Minha localização
                </Text>
              </TouchableOpacity>
            </View>

            <View
              className={`bg-white rounded-xl border px-3 ${
                activeInput === 'dropoff' ? 'border-red-400' : 'border-gray-100'
              }`}
            >
              <GooglePlacesAutocomplete
                ref={dropoffRef}
                placeholder="Local de entrega"
                onPress={(data, details = null) =>
                  handleSelectPlace(data, details, setDropoff, setShowDropoffList)
                }
                query={{ key: GOOGLE_API_KEY, language: 'pt-BR', components: 'country:ao' }}
                fetchDetails
                styles={cleanGoogleStyles}
                textInputProps={{
                  onFocus: () => { 
                    expand() // Força o BottomSheet a subir para 85%
                    setActiveInput('dropoff')
                    setShowDropoffList(true) 
                  },
                  onBlur: () => { setActiveInput(null); setShowDropoffList(false) },
                  placeholderTextColor: '#9ca3af',
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

      {/* CTA */}
      <TouchableOpacity
        onPress={nextStep}
        disabled={!canProceed}
        activeOpacity={0.85}
        className={`mt-5 py-4 rounded-2xl flex-row items-center justify-center ${
          canProceed ? 'bg-primary-200' : 'bg-gray-200'
        }`}
      >
        <Text className={`text-base font-bold mr-2 ${canProceed ? 'text-white' : 'text-gray-400'}`}>
          Ver opções e preço
        </Text>
        <ArrowRight size={18} color={canProceed ? 'white' : '#9ca3af'} />
      </TouchableOpacity>
    </View>
  )
})
