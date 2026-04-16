import React, { useRef, useCallback, useState } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import { useAlert } from '@/context/AlertContext'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import PromoBottomSheet from '@/components/ui/modal/PromoBottomSheet'
import type { BannerData } from '@/components/ui/modal/PromoBottomSheet'
import ServiceCard from '@/components/ui/card/ServiceCard'
import HomeHeader from '@/components/HomeHeader'

import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HomeStackParamList } from '@/types/navigation'
import ROUTES from '@/constants/routes'
import { useLocation } from '@/hooks/useLocation'
import { Clock, MapPin, Navigation, RefreshCw } from 'lucide-react-native'
import { useUserRides } from '@/hooks/useUserRides'
import { RideInterface } from '@/interfaces/IRide'
import { RideActiveCard } from '@/components/RideActiveCard'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppProvider } from '@/providers/AppProvider'
import { useNetwork } from '@/hooks/useNetwork'
import { IndicatorIcon } from '@/constants/icons'

const services = [
  {
    id: '1',
    title: 'Entregas',
    description: 'Envie pacotes com facilidade e rapidez',
    image: require('@/assets/images/illustration/box.png'),
    badgeText: 'Disponível',
    badgeVariant: 'active' as const
  },
  {
    id: '2',
    title: 'Piloto',
    description: 'Viagens ágeis em motas',
    image: require('@/assets/images/illustration/moto-boy.png'),
    badgeText: 'Em breve',
    badgeVariant: 'soon' as const
  }
]

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>()

  const { isConnected } = useNetwork()

  const { showAlert } = useAlert()
  const {
    activeRides,
    isLoading: isLoadingRides,
    refreshUserRides
  } = useUserRides()

  const promoSheetRef = useRef<BottomSheetModal>(null)
  const [selectedBanner, setSelectedBanner] = useState<BannerData | null>(null)

  const handleBannerPress = useCallback((banner: BannerData) => {
    setSelectedBanner(banner)
    setTimeout(() => promoSheetRef.current?.present(), 50)
  }, [])

  const handleBannerCta = useCallback(
    (action: string) => {
      promoSheetRef.current?.dismiss()

      // Small delay to let the bottom sheet close gracefully before navigating
      setTimeout(() => {
        if (action === 'delivery' || action === 'estimate') {
          handlePressDelivery()
        }
      }, 300)
    },
    [promoSheetRef]
  )

  const banners: BannerData[] = [
    {
      id: '1',
      title: 'Entrega com Confiança',
      description:
        'Estafetas verificados, entrega segura e acompanhamento em tempo real.',
      image: require('@/assets/banner/banner1.png'),
      details:
        'Os nossos estafetas são verificados e treinados para garantir entregas rápidas, seguras e rastreáveis em tempo real. Acompanhe cada passo da sua encomenda diretamente pelo app.',
      ctaLabel: 'Solicitar entrega',
      onCtaPress: () => handleBannerCta('delivery')
    },
    {
      id: '2',
      title: 'Rápido & Seguro Sempre',
      description: 'Tempos médios de entrega entre 15–30 min na sua zona.',
      image: require('@/assets/banner/banner2.png'),
      details:
        'Na sua área, o tempo médio de entrega varia entre 15 e 30 minutos, dependendo da distância e trânsito. Garantimos sempre a segurança do seu pacote.',
      ctaLabel: 'Ver estimativa',
      onCtaPress: () => handleBannerCta('estimate')
    }
  ]

  const { currentUserData, handleNotifications, navigationHomeStack } =
    useAppProvider()

  const {
    isLoading: locationLoading,
    location: currentLocation,
    requestCurrentLocation,
    error: locationError,
    address,
    isGettingAddress
  } = useLocation()

  const navigateTo = (to: any) => {
    navigation.navigate(to)
  }

  const handlePressRide = () => {
    showAlert('Corrida', 'No momento não encontra-se disponível', 'info')
  }
  const handlePressDelivery = () => {
    if (!isConnected) {
      showAlert(
        'Atenção',
        'Por favor, verifique sua conexão com a internet para poder solicitar uma entrega',
        'warning'
      )
      return
    }
    navigateTo(ROUTES.Rides.FLOW)
    // showAlert('Entregas', 'No momento não encontra-se disponível', 'info');
  }
  const handlePressPilot = () => {
    showAlert('Piloto', 'No momento não encontra-se disponível', 'info')
  }

  // Abrir mapa para ver localização
  const handleOpenMap = () => {
    if (!currentLocation) {
      showAlert('Atenção', 'Localização não disponível no momento.', 'warning')
      return
    }

    // Navegar para tela do mapa ou abrir app de mapas
    console.log('🗺️ Abrindo mapa com localização:', currentLocation)
    navigationHomeStack.navigate(ROUTES.Rides.FLOW)
  }

  const refreshAddress = async () => {
    if (!isConnected) {
      showAlert('Atenção', 'Sem conexão com a internet.', 'warning')
      return
    }
    await requestCurrentLocation()
  }

  // Navegar para detalhes da corrida
  const handleOpenRideDetails = (rideData: RideInterface) => {
    if (!isConnected) {
      showAlert(
        'Atenção',
        'Por favor, verifique sua conexão com a internet para poder voltar a ver os detalhes da corrida',
        'warning'
      )
      return
    }
    navigation.navigate(ROUTES.Rides.SUMMARY, {
      id: rideData.id,
      location: {
        pickup: rideData.pickup,
        dropoff: rideData.dropoff
      },
      receiver: {
        name: rideData.details?.receiver.name ?? '',
        phone: rideData.details?.receiver.phone ?? ''
      },
      article: {
        type: rideData.details?.item.type ?? '',
        description: rideData.details?.item.description ?? ''
      }
    })
  }

  // Atualizar lista de corridas
  const handleRefresh = async () => {
    if (!isConnected) {
      showAlert('Atenção', 'Sem conexão com a internet.', 'warning')
      return
    }
    await refreshUserRides()
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Fixed Header */}
      <HomeHeader
        user={currentUserData}
        onNotifications={handleNotifications}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRides || locationLoading}
            onRefresh={handleRefresh}
            colors={['#EF4444']}
            tintColor="#EF4444"
          />
        }
        contentContainerStyle={{ paddingBottom: 42 }}
      >
        {/* Seção de Localização */}
        <View className="mx-5 px-4 py-3 bg-white rounded-2xl border border-gray-200">
          <View className="flex-row items-start justify-between">
            {/* Localização */}
            <View className="flex-row items-start flex-1 gap-1">
              {/* Icone */}
              <MapPin size={16} color={address ? '#EF4444' : '#9CA3AF'} />

              {/* Localização */}
              <View className="flex-1">
                {isGettingAddress ? (
                  <Text className="text-sm text-gray-500">
                    Obtendo localização...
                  </Text>
                ) : address ? (
                  <Text
                    className="text-sm text-gray-800 font-medium"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {address}
                  </Text>
                ) : (
                  <Text className="text-sm text-gray-500">
                    Localização não disponível
                  </Text>
                )}

                {/* Status da localização */}
                <Text className="text-xs text-gray-400 mt-1">
                  {locationError ? 'Erro na localização' : 'GPS ativo'}
                </Text>
              </View>
            </View>

            {/* Botões de ação */}
            <View className="flex-row items-center gap-2">
              {/* Atualizar localização */}
              <TouchableOpacity
                onPress={refreshAddress}
                disabled={locationLoading || isGettingAddress}
                className={`p-2 rounded-full ${
                  isGettingAddress ? 'bg-gray-200' : 'bg-gray-100'
                }`}
              >
                <RefreshCw
                  size={16}
                  color={
                    locationLoading || isGettingAddress ? '#9CA3AF' : '#6B7280'
                  }
                />
              </TouchableOpacity>

              {/* Ver no mapa */}
              {currentLocation && (
                <TouchableOpacity
                  onPress={handleOpenMap}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <Navigation size={16} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Erro de localização */}
          {locationError && !isGettingAddress && (
            <View className="mt-2 flex-row items-center">
              <Text className="text-xs text-red-500 flex-1">
                {locationError}
              </Text>
              <TouchableOpacity
                // onPress={handleRequestLocation}
                className="ml-2"
              >
                <Text className="text-xs text-primary-200 font-semibold">
                  Tentar novamente
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Banner / Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4 pl-4"
        >
          {banners.map(banner => (
            <TouchableOpacity
              key={banner.id}
              onPress={() => handleBannerPress(banner)}
              activeOpacity={0.8}
            >
              <Image
                source={banner.image}
                className="w-72 h-36 mr-3 rounded-xl"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Corridas Ativas */}
        {activeRides.length > 0 && (
          <View className="mt-6 mx-5">
            {/* Header da seção */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Clock size={20} color="#EF4444" />
                <Text className="font-semibold text-lg text-gray-800 ml-2">
                  Suas Corridas Ativas
                </Text>
              </View>
              <Text className="text-primary-200 text-sm font-medium">
                {activeRides.length}{' '}
                {activeRides.length === 1 ? 'ativa' : 'ativas'}
              </Text>
            </View>

            {/* Lista de corridas ativas */}
            <View>
              {activeRides.map(ride => (
                <RideActiveCard
                  key={ride.id}
                  ride={ride}
                  onPress={handleOpenRideDetails}
                />
              ))}
            </View>

            {/* Separador */}
            <View className="border-b border-gray-200 my-4" />
          </View>
        )}

        {/* Seção de Serviços */}
        <View className="flex-row items-start px-5 mt-6">
          <View className="mt-1">
            <IndicatorIcon size={18} color="red" />
          </View>
          <View className="ml-2">
            <Text className="text-lg font-bold text-slate-900">
              Nossos Serviços
            </Text>
            <Text className="text-sm text-slate-500 mb-4">
              Escolha o que precisa
            </Text>
          </View>
        </View>

        <View className="px-5 mb-12 gap-4">
          {services.map(item => (
            <ServiceCard
              key={item.id}
              title={item.title}
              description={item.description}
              image={item.image}
              badgeText={item.badgeText}
              badgeVariant={item.badgeVariant}
              onPress={
                item.id === '1'
                  ? handlePressDelivery
                  : item.id === '2'
                    ? handlePressPilot
                    : handlePressRide
              }
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Tabs já ficam no seu router principal */}

      {/* Promo Bottom Sheet */}
      <PromoBottomSheet ref={promoSheetRef} banner={selectedBanner} />
    </SafeAreaView>
  )
}
