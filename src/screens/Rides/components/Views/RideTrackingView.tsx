import React, { memo } from 'react'
import { LoadingCard } from '../Cards/LoadingCard'
import { RideCompletedScreen } from './RideFinished'
import { RideStatusManager } from '../Status/RideStatusManager'
import { RideInterface } from '@/interfaces/IRide'
import { RideStatusType } from '@/types/enum'
import { RideFareInterface } from '@/interfaces/IRideFare'
import { formatMoney } from '@/utils/formattedNumber'
import type { RouteInfo, WaitTimerInfo } from '@/hooks/ride/useRideSummary'

interface RideTrackingViewProps {
  rideId: string | undefined
  currentRide: RideInterface | null
  isLoadingData: boolean
  rideStatus: RideStatusType
  fareDetails: RideFareInterface | null
  route: RouteInfo
  driverRoute: RouteInfo
  waitTimer: WaitTimerInfo
  onCancel: () => void
  onAutoCancel: (reason: string) => void
  onCenterMap: () => void
}

export const RideTrackingView = memo(function RideTrackingView({
  rideId,
  currentRide,
  isLoadingData,
  rideStatus,
  fareDetails,
  route,
  driverRoute,
  waitTimer,
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
      pickupDescription={currentRide?.pickup.description}
      dropoffDescription={currentRide?.dropoff.description}
      price={formatMoney(currentRide?.fare?.total ?? fareDetails?.total ?? 0, 0)}
      searchStartTime={currentRide?.created_at}
      onCancel={onCancel}
      onAutoCancel={onAutoCancel}
      onCenterMap={onCenterMap}
      duration={route.durationMinutes}
      driverName={currentRide?.driver?.name}
      driverDuration={driverRoute.durationText ?? '0'}
      currentTime={waitTimer.formatted}
      additionalTime={String(waitTimer.extraMinutes)}
      customerName={
        currentRide?.user?.name || currentRide?.details?.receiver.name
      }
      packageInfo={currentRide?.details?.item}
      distanceTraveled={driverRoute.distanceKm}
      distanceTotal={route.distanceKm}
    />
  )
})
