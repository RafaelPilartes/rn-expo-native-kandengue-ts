// src/screens/Main/History/history.tsx
import React, { useCallback, useRef, useState, useEffect } from 'react'
import { View, SectionList, Text, ActivityIndicator } from 'react-native'
import { BottomSheetModal } from '@gorhom/bottom-sheet'

// Components
import RideItem from './components/RideItem'
import RideDetailsBottomSheet from './components/RideDetailsSheetModal'

// Hooks e Types
import { useRidesViewModel } from '@/viewModels/RideViewModel'
import { useAuthStore } from '@/storage/store/useAuthStore'
import { RideInterface } from '@/interfaces/IRide'
import { BaseLoadingPage } from '@/components/loadingPage'
import { toDate } from '@/utils/formatDate'
import { useUserRides } from '@/context/UserRidesContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PageHeader } from '@/components/PageHeader'
import { useAppProvider } from '@/providers/AppProvider'

type Section = {
  title: string
  data: RideInterface[]
}

// Agrupar corridas por período
const groupRidesByPeriod = (rides: RideInterface[]): Section[] => {
  const today = new Date()
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const todayRides: RideInterface[] = []
  const thisWeekRides: RideInterface[] = []
  const earlierRides: RideInterface[] = []

  rides.forEach(ride => {
    if (!ride.created_at) return

    const rideDate = toDate(ride.created_at) as Date

    if (rideDate.toDateString() === today.toDateString()) {
      todayRides.push(ride)
    } else if (rideDate >= oneWeekAgo) {
      thisWeekRides.push(ride)
    } else if (rideDate >= oneMonthAgo) {
      earlierRides.push(ride)
    } else {
      earlierRides.push(ride)
    }
  })

  const sections: Section[] = []

  if (todayRides.length > 0) {
    sections.push({ title: 'Hoje', data: todayRides })
  }

  if (thisWeekRides.length > 0) {
    sections.push({ title: 'Esta Semana', data: thisWeekRides })
  }

  if (earlierRides.length > 0) {
    sections.push({ title: 'Anteriormente', data: earlierRides })
  }

  return sections
}

// Calcular totais
const calculateTotals = (rides: RideInterface[]) => {
  if (!rides) return { totalRides: 0 }

  const totalRides = rides.length

  return { totalRides }
}

export default function History() {
  const { user } = useAuthStore()
  const { navigationHomeStack } = useAppProvider()

  const {
    userRides,
    isLoading: isLoadingRides,
    loadMoreRides,
    refreshUserRides,
    isRefreshing
  } = useUserRides()

  const [selectedRide, setSelectedRide] = useState<RideInterface | null>(null)
  const [sections, setSections] = useState<Section[]>([])

  const snapPoints = React.useMemo(() => ['55%', '70%'], [])
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  // Agrupar corridas quando mudam
  useEffect(() => {
    const groupedSections = groupRidesByPeriod(userRides)
    setSections(groupedSections)
  }, [userRides])

  const { totalRides } = calculateTotals(userRides)

  const handlePresentModalPress = useCallback((ride: RideInterface) => {
    setSelectedRide(ride)
    bottomSheetModalRef.current?.present()
  }, [])

  const handleSheetChanges = useCallback((index: number) => {
    console.log('BottomSheet index:', index)
  }, [])

  const handleRefresh = async () => {
    try {
      await refreshUserRides()
    } finally {
      bottomSheetModalRef.current?.close()
    }
  }

  const handleLoadMore = async () => {
    if (isLoadingRides) return // evita múltiplas chamadas

    try {
      await loadMoreRides()
    } finally {
      bottomSheetModalRef.current?.close()
    }
  }

  useEffect(() => {
    const unsubscribe = navigationHomeStack.addListener('blur', () => {
      bottomSheetModalRef.current?.close()
    })

    return unsubscribe
  }, [navigationHomeStack])

  if (isLoadingRides && userRides.length === 0) {
    return (
      <BaseLoadingPage
        title="Histórico de Corridas"
        primaryText={'Buscando corridas...'}
        canGoBack={false}
      />
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <PageHeader title="Histórico de Corridas" canGoBack={false} />

      {/* Total de corridas e total ganho */}
      <View className="px-4 mb-2 mt-4 flex-row items-center justify-between gap-4">
        {/* Total de corridas */}
        <View className="flex-1 flex-col justify-center items-center py-6 bg-white rounded-lg border border-gray-200/40">
          <Text className="text-2xl font-semibold text-gray-700">
            {totalRides}
          </Text>
          <Text className="text-sm text-gray-500">Total de corridas</Text>
        </View>
      </View>

      {userRides.length === 0 ? (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-gray-500 text-lg text-center mb-4">📝</Text>
          <Text className="text-gray-500 text-center text-lg font-medium mb-2">
            Nenhuma corrida encontrada
          </Text>
          <Text className="text-gray-400 text-center">
            Suas corridas aparecerão aqui quando você solicitar uma.
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id as string}
          renderItem={({ item }) => (
            <RideItem
              item={item}
              onPress={() => handlePresentModalPress(item)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-base font-semibold text-gray-700 px-4 mt-4 mb-2">
              {title}
            </Text>
          )}
          contentContainerStyle={{ paddingBottom: 75 }}
          showsVerticalScrollIndicator={false}
          // ⬇️ Pull to refresh
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          // ⬇️ Infinite scroll
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          // Loader no final da lista
          ListFooterComponent={
            isLoadingRides ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#e0212d" />
              </View>
            ) : null
          }
        />
      )}

      {/* Componente BottomSheet unificado */}
      <RideDetailsBottomSheet
        ref={bottomSheetModalRef}
        selectedRide={selectedRide}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      />
    </SafeAreaView>
  )
}
