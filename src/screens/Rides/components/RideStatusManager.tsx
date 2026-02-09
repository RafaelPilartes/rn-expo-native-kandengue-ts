import React from 'react'
import { View, Text } from 'react-native'
import { RideStatusIdle } from './RideStatusIdle'
import { RideStatusArrival } from './RideStatusArrival'
import { RideStatusArrivedDestination } from './RideStatusArrivedDestination'
import { RideStatusDelivering } from './RideStatusDelivering'
import { DriverStatusOverlay } from './DriverStatusOverlay'
import { converter } from '@/utils/converter'
// import { RideStatusCompleted } from './RideStatusCompleted';

interface Props {
  status: string
  // Idle props
  pickupDescription?: string
  dropoffDescription?: string
  price?: string
  searchStartTime?: string // or Date?
  onCancel?: () => void
  onAutoCancel?: (reason: string) => void
  onCenterMap?: () => void

  // Driver/Active props
  duration?: number
  driverName?: string
  driverDuration?: string // Estimated time

  // Arrival/Delivering props
  currentTime?: number
  additionalTime?: string
  customerName?: string
  packageInfo?: any
  distanceTraveled?: number
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
  distanceTraveled,
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
          searchStartTime={
            searchStartTime ? new Date(searchStartTime) : undefined
          }
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
          currentTime={
            currentTime ? converter.numberToString(currentTime) : '0'
          }
          additionalTime={String(additionalTime)}
          customerName={customerName}
        />
      )
    case 'picked_up':
      return (
        <RideStatusDelivering
          distanceTraveled={distanceTraveled ? String(distanceTraveled) : '0'}
          distanceTotal={distanceTotal ? String(distanceTotal) : '0'}
          duration={duration ? String(duration) : '0'}
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
      return (
        <View className="absolute top-safe left-4 right-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
          <Text className="text-lg font-bold text-red-600 text-center mb-2">
            Corrida Cancelada
          </Text>
          <Text className="text-gray-600 text-center">
            Esta corrida foi cancelada. Você pode criar uma nova.
          </Text>
        </View>
      )
    default:
      return null
  }
}
