// src/services/google/googleApi.ts
import { GOOGLE_API_KEY } from '@/constants/keys'
import {
  AddressComponent,
  AddressResponse,
  AddressResult
} from '@/types/geoLocation'
import { getDistanceInMeters } from '@/helpers/haversine'

// Cache em memória para reduzir custos da Geocoding API
let lastCoords: { lat: number; lng: number } | null = null
let lastAddressResponse: AddressResponse | null = null

const DISTANCE_THRESHOLD_METERS = 200

export const getAddressFromCoords = async (
  lat: number,
  lng: number
): Promise<AddressResponse | string> => {
  // Verificação de Cache por Distância
  if (lastCoords && lastAddressResponse) {
    const distance = getDistanceInMeters(
      lat,
      lng,
      lastCoords.lat,
      lastCoords.lng
    )

    if (distance < DISTANCE_THRESHOLD_METERS) {
      console.log(
        `[Geocoding API] Usando cache (${Math.round(distance)}m < ${DISTANCE_THRESHOLD_METERS}m)`
      )
      return lastAddressResponse
    }
  }

  try {
    console.log('[Geocoding API] Chamando Google Maps API...')
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}&language=pt`
    )

    const data = await response.json()

    if (data.status === 'OK' && data.results?.length > 0) {
      const fullAddr: AddressResult = data.results[0]
      const components: AddressComponent[] = fullAddr.address_components || []

      // Extrai partes específicas
      const city =
        components.find((c: AddressComponent) =>
          c.types.includes('administrative_area_level_2')
        )?.long_name || ''

      const district =
        components.find(
          (c: AddressComponent) =>
            c.types.includes('sublocality') || c.types.includes('neighborhood')
        )?.long_name || ''

      const country =
        components.find((c: AddressComponent) => c.types.includes('country'))
          ?.long_name || ''

      const shortAddr =
        district && city
          ? `${district}, ${city}`
          : city || country || 'Localização desconhecida'

      const finalResponse: AddressResponse = {
        addr: fullAddr.formatted_address || 'Endereço não encontrado',
        shortAddr,
        placeId: fullAddr.place_id,
        city,
        country,
        district
      }

      // Atualiza o cache
      lastCoords = { lat, lng }
      lastAddressResponse = finalResponse

      return finalResponse
    } else {
      console.log('Erro na API Geocoding:', data.status)
      return 'Endereço não disponível'
    }
  } catch (err) {
    console.log('Erro ao buscar endereço:', err)
    return 'Erro ao obter endereço'
  }
}
