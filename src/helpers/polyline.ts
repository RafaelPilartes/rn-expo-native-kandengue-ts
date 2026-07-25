/**
 * Polyline utilities for Uber-style progressive route rendering.
 * Trims a polyline from the driver's current position to the destination,
 * so the line "shrinks" as the driver advances.
 */

type LatLng = { latitude: number; longitude: number }

/**
 * Calculate the squared distance between two points (no sqrt for performance).
 */
function distanceSquared(a: LatLng, b: LatLng): number {
  const dLat = a.latitude - b.latitude
  const dLng = a.longitude - b.longitude
  return dLat * dLat + dLng * dLng
}

/**
 * Find the index of the closest point in the polyline to the given position.
 */
function findClosestPointIndex(polyline: LatLng[], position: LatLng): number {
  let closestIndex = 0
  let closestDist = Infinity

  for (let i = 0; i < polyline.length; i++) {
    const dist = distanceSquared(polyline[i], position)
    if (dist < closestDist) {
      closestDist = dist
      closestIndex = i
    }
  }

  return closestIndex
}

/**
 * Trim the polyline from the driver's current position to the end (destination).
 * Returns only the remaining segment, prepending the driver's exact position.
 *
 * This creates the Uber-style "shrinking polyline" effect.
 *
 * @param polyline - The full route coordinates
 * @param currentPosition - The driver's current position
 * @returns The trimmed polyline starting from the driver's position
 */
export function trimPolylineFromPosition(
  polyline: LatLng[],
  currentPosition: LatLng
): LatLng[] {
  if (polyline.length === 0) return []
  if (polyline.length === 1) return [currentPosition, polyline[0]]

  const closestIndex = findClosestPointIndex(polyline, currentPosition)

  // Take remaining points from closest onwards + prepend driver position
  const remaining = polyline.slice(closestIndex)

  // Replace the first point with the driver's exact position for smooth rendering
  return [currentPosition, ...remaining.slice(1)]
}

/**
 * Calculate the total distance of a polyline in kilometers.
 * Uses the Haversine formula for accuracy.
 */
export function polylineDistanceKm(polyline: LatLng[]): number {
  if (polyline.length < 2) return 0

  let totalDistance = 0

  for (let i = 1; i < polyline.length; i++) {
    totalDistance += haversineKm(polyline[i - 1], polyline[i])
  }

  return totalDistance
}

/**
 * Haversine formula — distance between two lat/lng points in km.
 */
function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371 // Earth's radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(b.latitude - a.latitude)
  const dLon = toRad(b.longitude - a.longitude)

  const sinLat = Math.sin(dLat / 2)
  const sinLon = Math.sin(dLon / 2)

  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinLon * sinLon

  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}
