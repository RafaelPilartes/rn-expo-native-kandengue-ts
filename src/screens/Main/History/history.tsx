// src/screens/Main/History/history.tsx
import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react'
import {
  View,
  SectionList,
  Text,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Filter, X } from 'lucide-react-native'

// Components
import RideItem from './components/RideItem'
import RideDetailsBottomSheet from './components/RideDetailsSheetModal'
import FilterSheet, { FilterValues } from './components/FilterSheet'
import HistorySkeleton from './components/HistorySkeleton'
import { PageHeader } from '@/components/PageHeader'
import { BaseLoadingPage } from '@/components/loadingPage'

// Hooks e Types
import { useAuthStore } from '@/storage/store/useAuthStore'
import { RideInterface } from '@/interfaces/IRide'
import { toDate } from '@/utils/formatDate'
import { useUserRides } from '@/context/UserRidesContext'
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
  const [filters, setFilters] = useState<FilterValues>({
    status: 'all',
    type: 'all'
  })

  const snapPoints = React.useMemo(() => ['55%', '70%'], [])
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const filterSheetRef = useRef<BottomSheetModal>(null)

  // Aplicar filtros e agrupar
  const filteredRides = useMemo(() => {
    return userRides.filter(ride => {
      // Filter by status
      if (filters.status !== 'all' && ride.status !== filters.status) {
        return false
      }

      // Filter by type
      if (filters.type !== 'all' && ride.type !== filters.type) {
        return false
      }

      return true
    })
  }, [userRides, filters])

  // Agrupar corridas quando mudam
  useEffect(() => {
    const groupedSections = groupRidesByPeriod(filteredRides)
    setSections(groupedSections)
  }, [filteredRides])

  const { totalRides } = calculateTotals(filteredRides)

  const hasActiveFilters = filters.status !== 'all' || filters.type !== 'all'

  const handleApplyFilters = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters)
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilters({ status: 'all', type: 'all' })
  }, [])

  const handleOpenFilters = useCallback(() => {
    filterSheetRef.current?.present()
  }, [])

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
      <SafeAreaView className="flex-1 bg-slate-50">
        <PageHeader title="Histórico de Corridas" canGoBack={false} />
        <HistorySkeleton />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <PageHeader
        title="Histórico de Corridas"
        canGoBack={false}
        rightComponent={
          <TouchableOpacity
            onPress={handleOpenFilters}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
            activeOpacity={0.7}
          >
            <Filter size={20} color="#1E293B" />
          </TouchableOpacity>
        }
      />

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <View className="px-4 pt-4 pb-2">
          <View className="flex-row items-center gap-2 flex-wrap">
            {filters.status !== 'all' && (
              <View className="bg-slate-900 px-3 py-1.5 rounded-full flex-row items-center gap-2">
                <Text className="text-white text-xs font-semibold">
                  {filters.status === 'completed'
                    ? 'Completadas'
                    : 'Canceladas'}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setFilters(prev => ({ ...prev, status: 'all' }))
                  }
                >
                  <X size={14} color="white" />
                </TouchableOpacity>
              </View>
            )}
            {filters.type !== 'all' && (
              <View className="bg-slate-900 px-3 py-1.5 rounded-full flex-row items-center gap-2">
                <Text className="text-white text-xs font-semibold">
                  {filters.type === 'car'
                    ? 'Carro'
                    : filters.type === 'motorcycle'
                      ? 'Moto'
                      : filters.type === 'bicycle'
                        ? 'Bicicleta'
                        : 'Entrega'}
                </Text>
                <TouchableOpacity
                  onPress={() => setFilters(prev => ({ ...prev, type: 'all' }))}
                >
                  <X size={14} color="white" />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={handleClearFilters}>
              <Text className="text-slate-500 text-xs font-semibold underline">
                Limpar tudo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
          renderItem={({ item, index }) => (
            <RideItem
              item={item}
              index={index}
              onPress={handlePresentModalPress}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-base font-semibold text-gray-700 px-4 mt-4 mb-2">
              {title}
            </Text>
          )}
          contentContainerStyle={{ paddingBottom: 75 }}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
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

      {/* Filter Sheet */}
      <FilterSheet
        ref={filterSheetRef}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  )
}
