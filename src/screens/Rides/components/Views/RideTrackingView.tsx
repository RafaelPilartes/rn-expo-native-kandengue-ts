import React, { memo } from 'react'
import { LoadingCard } from '../Cards/LoadingCard'
import { RideCompletedScreen } from './RideFinished'
import { RideStatusManager } from '../Status/RideStatusManager'
import { RideInterface } from '@/interfaces/IRide'
import { RideStatusType } from '@/types/enum'
import { RideFareInterface } from '@/interfaces/IRideFare'
import { CustomPlace } from '@/types/places'
import { formatMoney } from '@/utils/formattedNumber'

interface RideTrackingViewProps {
  rideId: string | undefined
  currentRide: RideInterface | null
  isLoadingData: boolean
  rideStatus: RideStatusType
  location: {
    pickup: CustomPlace
    dropoff: CustomPlace
  }
  fareDetails: RideFareInterface | null
  fareDetailsTemp: RideFareInterface | null
  durationMinutes: number | undefined
  durationDriver: string | null
  distanceKm: number
  currentTime: string | null
  additionalTime: number
  onCancel: () => void
  onAutoCancel: (reason: string) => void
  onCenterMap: () => void
}

export const RideTrackingView = memo(function RideTrackingView({
  rideId,
  currentRide,
  isLoadingData,
  rideStatus,
  location,
  fareDetails,
  fareDetailsTemp,
  durationMinutes,
  durationDriver,
  distanceKm,
  currentTime,
  additionalTime,
  onCancel,
  onAutoCancel,
  onCenterMap
}: RideTrackingViewProps) {
  if (isLoadingData && !currentRide) {
    return <LoadingCard />
  }

  if (rideStatus === 'completed') {
    return (
      <RideCompletedScreen
        rideId={rideId || ''}
        rideDetails={currentRide as RideInterface}
      />
    )
  }

  return (
    <RideStatusManager
      status={rideStatus}
      pickupDescription={
        currentRide?.pickup.description || location.pickup.description
      }
      dropoffDescription={
        currentRide?.dropoff.description || location.dropoff.description
      }
      price={formatMoney(fareDetails?.total || fareDetailsTemp?.total || 0, 0)}
      searchStartTime={currentRide?.created_at}
      onCancel={onCancel}
      onAutoCancel={onAutoCancel}
      onCenterMap={onCenterMap}
      duration={durationMinutes}
      driverName={currentRide?.driver?.name}
      driverDuration={durationDriver ?? '0'}
      currentTime={currentTime ?? '0'}
      additionalTime={String(additionalTime)}
      customerName={
        currentRide?.user?.name || currentRide?.details?.receiver.name
      }
      packageInfo={currentRide?.details?.item}
      distanceTraveled={distanceKm}
      distanceTotal={distanceKm}
    />
  )
})
