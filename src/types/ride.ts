export type PaymentMethodType = 'cash' | 'card' | 'wallet'
export type PickupOptionType = 'door' | 'curb'

export type RideDetailsType = {
  receiver: {
    name: string
    phone: string
  }
  // Who is sending the package (optional — defaults to the logged-in user)
  sender?: {
    name: string
    phone: string
  }
  item: {
    type: string
    description: string
    quantity: number
    size: 'small' | 'medium' | 'large'
    weight?: number
  }
  // How the driver should meet the sender at pickup
  pickup_option?: PickupOptionType
  // Payment method chosen by the user
  payment_method?: PaymentMethodType
  // Instructions for the driver
  driver_instructions?: string
}

export type RateType = {
  start_time: string
  end_time: string
  base_fare: number
  price_per_km: number
  wait_time_free_minutes: number
  price_per_minute: number
}

export type PayoutsType = {
  driver_percent: number
  company_percent: number
  pension_fund_percent: number
}

export type LiveLocationType = {
  latitude: number
  longitude: number
  timestamp: Date
}
