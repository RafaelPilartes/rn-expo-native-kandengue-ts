import React, { memo } from 'react'
import { View } from 'react-native'
import { RoutePreviewCard } from '../Cards/RoutePreviewCard'
import { MyLocationButton } from '../Buttons/MyLocationButton'
import { ConfirmRideCard } from '../Cards/ConfirmRideCard'
import { formatMoney } from '@/utils/formattedNumber'
import { CustomPlace } from '@/types/places'
import { RideFareInterface } from '@/interfaces/IRideFare'

interface RideEstimationViewProps {
  location: {
    pickup: CustomPlace
    dropoff: CustomPlace
  }
  fareDetails: RideFareInterface | null
  distance: string | undefined
  duration: string | undefined
  isLoading: boolean
  onConfirm: () => void
  onCancel: () => void
  onCenterMap: () => void
}

export const RideEstimationView = memo(function RideEstimationView({
  location,
  fareDetails,
  distance,
  duration,
  isLoading,
  onConfirm,
  onCancel,
  onCenterMap
}: RideEstimationViewProps) {
  return (
    <>
      <RoutePreviewCard
        pickupDescription={location.pickup.name ?? ''}
        dropoffDescription={location.dropoff.name ?? ''}
      />

      <View style={{ position: 'absolute', bottom: 180, left: 28 }}>
        <MyLocationButton onPress={onCenterMap} />
      </View>

      <ConfirmRideCard
        price={formatMoney(fareDetails?.total || 0, 0)}
        duration={String(duration)}
        distance={distance ?? '0'}
        isLoading={isLoading}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </>
  )
})
