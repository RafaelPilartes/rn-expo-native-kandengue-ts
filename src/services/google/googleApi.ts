// src/services/google/googleApi.ts
import { GOOGLE_API_KEY } from '@/constants/keys';
import {
  AddressComponent,
  AddressResponse,
  AddressResult,
} from '@/types/geoLocation';

export const getAddressFromCoords = async (
  lat: number,
  lng: number,
): Promise<AddressResponse | string> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}&language=pt`,
    );

    const data = await response.json();

    if (data.status === 'OK' && data.results?.length > 0) {
      const fullAddr: AddressResult = data.results[0];
      const components: AddressComponent[] = fullAddr.address_components || [];

      // Extrai partes específicas
      const city =
        components.find((c: AddressComponent) =>
          c.types.includes('administrative_area_level_2'),
        )?.long_name || '';

      const district =
        components.find(
          (c: AddressComponent) =>
            c.types.includes('sublocality') || c.types.includes('neighborhood'),
        )?.long_name || '';

      const country =
        components.find((c: AddressComponent) => c.types.includes('country'))
          ?.long_name || '';

      const shortAddr =
        district && city
          ? `${district}, ${city}`
          : city || country || 'Localização desconhecida';

      return {
        addr: fullAddr.formatted_address || 'Endereço não encontrado',
        shortAddr,
        placeId: fullAddr.place_id,
        city,
        country,
        district,
      };
    } else {
      console.log('Erro na API Geocoding:', data.status);
      return 'Endereço não disponível';
    }
  } catch (err) {
    console.log('Erro ao buscar endereço:', err);
    return 'Erro ao obter endereço';
  }
};
