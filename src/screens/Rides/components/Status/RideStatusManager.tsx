import React from 'react'
import { RideStatusIdle } from './RideStatusIdle'
import { RideStatusArrival } from './RideStatusArrival'
import { RideStatusArrivedDestination } from './RideStatusArrivedDestination'
import { RideStatusDelivering } from './RideStatusDelivering'
import { RideStatusCanceled } from './RideStatusCanceled'
import { DriverStatusOverlay } from './DriverStatusOverlay'
import { converter } from '@/utils/converter'

interface Props {
  status: string
  // Idle props
  pickupDescription?: string
  dropoffDescription?: string
  price?: string
  searchStartTime?: Date | undefined
  onCancel?: () => void
  onAutoCancel?: (reason: string) => void
  onCenterMap?: () => void

  // Driver/Active props
  duration?: number
  driverName?: string
  driverDuration?: string

  // Arrival/Delivering props
  currentTime?: string
  additionalTime?: string
  customerName?: string
  packageInfo?: any
  distanceRemaining?: number
  distanceTotal?: number
}

export const RideStatusManager: React.FC<Props> = ({
  status,
  pickupDescription,
  dropoffDescription,
  price,
  searchStartTime,
  onCancel,
  onAutoCancel,
  onCenterMap,
  duration,
  driverName,
  driverDuration,
  currentTime,
  additionalTime,
  customerName,
  packageInfo,
  distanceRemaining,
  distanceTotal
}) => {
  switch (status) {
    case 'idle':
      return (
        <RideStatusIdle
          pickupDescription={pickupDescription ?? ''}
          dropoffDescription={dropoffDescription ?? ''}
          estimatedTime="2-5 min"
          price={price ?? '0'}
          searchStartTime={searchStartTime}
          onCancel={onCancel ?? (() => {})}
          onAutoCancel={onAutoCancel ?? (() => {})}
          onCenterMap={onCenterMap ?? (() => {})}
        />
      )
    case 'driver_on_the_way':
      return (
        <DriverStatusOverlay
          duration={duration ? converter.numberToString(duration) : '0'}
          driverName={driverName ?? 'Motorista'}
          estimatedTime={driverDuration ?? ''}
        />
      )
    case 'arrived_pickup':
      return (
        <RideStatusArrival
          rideStatus={status as any}
          currentTime={currentTime ?? '0'}
          additionalTime={String(additionalTime)}
          customerName={customerName}
        />
      )
    case 'picked_up':
      return (
        <RideStatusDelivering
          distanceRemaining={distanceRemaining ? String(distanceRemaining) : '0'}
          distanceTotal={distanceTotal ? String(distanceTotal) : '0'}
          duration={driverDuration ? String(driverDuration) : '0'}
          packageInfo={packageInfo}
          customerName={customerName}
        />
      )
    case 'arrived_dropoff':
      return (
        <RideStatusArrivedDestination
          customerName={customerName}
          packageInfo={packageInfo}
        />
      )
    case 'canceled':
      return <RideStatusCanceled />
    default:
      return null
  }
}
