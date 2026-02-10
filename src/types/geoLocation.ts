export type GeoLocationType = {
  description: string
  place_id: string
  name?: string
  latitude: number
  longitude: number
}

export type LocationType = {
  latitude: number
  longitude: number
  heading?: number
  speed?: number
  accuracy?: number
  updated_at?: Date
}

export type AddressComponent = {
  long_name: string
  short_name: string
  types: string[]
}

export type AddressResult = {
  formatted_address: string
  place_id: string
  address_components: AddressComponent[]
}

export type AddressResponse = {
  addr: string // Endereço completo
  shortAddr: string // Endereço resumido
  placeId?: string
  city?: string
  country?: string
  district?: string
}
