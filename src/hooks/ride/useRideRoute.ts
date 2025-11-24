// src/screens/hooks/useRideRoute.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import { GOOGLE_API_KEY } from '@/constants/keys';

type LatLng = { latitude: number; longitude: number };

export function useRideRoute(pickup?: LatLng | null, dropoff?: LatLng | null) {
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [distanceText, setDistanceText] = useState<string>('');
  const [durationText, setDurationText] = useState<string>('');
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [durationMinutes, setDurationMinutes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!pickup || !dropoff) {
      setRouteCoords([]);
      setDistanceText('');
      setDurationText('');
      setDistanceKm(0);
      setDurationMinutes(0);
      return;
    }

    let canceled = false;
    const fetchRoute = async () => {
      try {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${pickup.latitude},${pickup.longitude}&destination=${dropoff.latitude},${dropoff.longitude}&key=${GOOGLE_API_KEY}&mode=driving&language=pt-BR&region=BR`;
        const res = await axios.get(url.replace(/\s+/g, ''));

        const route = res.data.routes?.[0];
        if (!route || canceled) return;

        const leg = route.legs[0];

        const decoded = polyline.decode(route.overview_polyline.points);
        const coords = decoded.map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }));

        // Distância em metros → km
        const distanceKmValue = leg.distance.value / 1000;
        // Duração em segundos → minutos
        const durationMinutesValue = Math.round(leg.duration.value / 60);

        setRouteCoords(coords);
        setDistanceKm(distanceKmValue);
        setDurationMinutes(durationMinutesValue);
        setDistanceText(leg.distance.text);
        setDurationText(leg.duration.text);
      } catch (err) {
        console.warn('useRideRoute error:', err);
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    fetchRoute();
  }, [pickup, dropoff]);

  return {
    routeCoords,
    distanceKm,
    durationMinutes,
    distance: distanceText,
    duration: durationText,
    loading,
  };
}
