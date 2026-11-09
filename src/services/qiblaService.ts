export const KAABA_COORDINATES = {
  latitude: 21.422487,
  longitude: 39.826206,
};

// Converts degrees to radians
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Converts radians to degrees
function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculates the forward azimuth / bearing to the Holy Kaaba in Makkah.
 * Returns bearing in degrees [0, 360).
 */
export function calculateQiblaBearing(latitude: number, longitude: number): number {
  const phi1 = toRadians(latitude);
  const phi2 = toRadians(KAABA_COORDINATES.latitude);
  const deltaLambda = toRadians(KAABA_COORDINATES.longitude - longitude);

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

  let qibla = toDegrees(Math.atan2(y, x));
  qibla = (qibla + 360) % 360;

  return Math.round(qibla * 10) / 10;
}

/**
 * Calculates the great-circle distance to the Holy Kaaba in kilometers (Haversine formula).
 */
export function calculateDistanceToKaaba(latitude: number, longitude: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRadians(KAABA_COORDINATES.latitude - latitude);
  const dLon = toRadians(KAABA_COORDINATES.longitude - longitude);

  const lat1 = toRadians(latitude);
  const lat2 = toRadians(KAABA_COORDINATES.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Translates degrees into Arabic cardinal directions (شمال، شرق، جنوب، غرب)
 */
export function getBearingArabicName(degrees: number): string {
  const normalized = (degrees + 360) % 360;
  if (normalized >= 337.5 || normalized < 22.5) return 'شمال';
  if (normalized >= 22.5 && normalized < 67.5) return 'شمال شرق';
  if (normalized >= 67.5 && normalized < 112.5) return 'شرق';
  if (normalized >= 112.5 && normalized < 157.5) return 'جنوب شرق';
  if (normalized >= 157.5 && normalized < 202.5) return 'جنوب';
  if (normalized >= 202.5 && normalized < 247.5) return 'جنوب غرب';
  if (normalized >= 247.5 && normalized < 292.5) return 'غرب';
  return 'شمال غرب';
}
