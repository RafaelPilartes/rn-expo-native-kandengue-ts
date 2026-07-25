import { useEffect, useState, useRef, useCallback } from 'react'
import axios from 'axios'
import polyline from '@mapbox/polyline'
import { GOOGLE_API_KEY } from '@/constants/keys'

type LatLng = { latitude: number; longitude: number }

const ROUTE_THROTTLE_MS = 10_000 // 10 seconds between API calls

export function useRideRoute(origin?: LatLng | null, destination?: LatLng | null) {
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([])
  const [distanceText, setDistanceText] = useState('')
  const [durationText, setDurationText] = useState('')
  const [distanceKm, setDistanceKm] = useState(0)
  const [durationMinutes, setDurationMinutes] = useState(0)
  const [loading, setLoading] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const lastFetchRef = useRef(0)

  const clearState = useCallback(() => {
    setRouteCoords([])
    setDistanceText('')
    setDurationText('')
    setDistanceKm(0)
    setDurationMinutes(0)
  }, [])

  useEffect(() => {
    // Extract values for stable comparison
    const oLat = origin?.latitude
    const oLng = origin?.longitude
    const dLat = destination?.latitude
    const dLng = destination?.longitude

    if (!oLat || !oLng || !dLat || !dLng) {
      clearState()
      return
    }

    // Cancel any pending timer or request
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (abortRef.current) {
      abortRef.current.abort()
    }

    const fetchRoute = async () => {
      const controller = new AbortController()
      abortRef.current = controller

      try {
        setLoading(true)
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${oLat},${oLng}&destination=${dLat},${dLng}&key=${GOOGLE_API_KEY}&mode=driving&language=pt-BR&region=BR`
        const res = await axios.get(url.replace(/\s+/g, ''), {
          signal: controller.signal
        })

        if (controller.signal.aborted) return

        const route = res.data.routes?.[0]
        if (!route) return

        const leg = route.legs[0]
        const decoded = polyline.decode(route.overview_polyline.points)
        const coords = decoded.map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng
        }))

        setRouteCoords(coords)
        setDistanceKm(leg.distance.value / 1000)
        setDurationMinutes(Math.round(leg.duration.value / 60))
        setDistanceText(leg.distance.text)
        setDurationText(leg.duration.text)
        lastFetchRef.current = Date.now()
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.warn('useRideRoute error:', err)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    // Throttle: if last fetch was recent, delay the next one
    const timeSinceLastFetch = Date.now() - lastFetchRef.current
    const delay = timeSinceLastFetch < ROUTE_THROTTLE_MS
      ? ROUTE_THROTTLE_MS - timeSinceLastFetch
      : 0

    if (delay === 0) {
      fetchRoute()
    } else {
      timerRef.current = setTimeout(fetchRoute, delay)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      if (abortRef.current) {
        abortRef.current.abort()
        abortRef.current = null
      }
    }
    // Compare by VALUE not reference — only refetch when coordinates actually change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin?.latitude, origin?.longitude, destination?.latitude, destination?.longitude])

  return {
    routeCoords,
    distanceKm,
    durationMinutes,
    distance: distanceText,
    duration: durationText,
    loading
  }
}
