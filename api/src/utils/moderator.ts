// TODO: Make this dynamic - Bangalore's approximate geographical center
const BANGALORE_CENTER = {
  lat: 12.9716,
  lng: 77.5946
};

const GUWAHATI_CENTER = {
  lat: 26.1445,
  lng: 91.7364
}

const CITY_CENTERS = {
  BANGALORE: BANGALORE_CENTER,
  GUWAHATI: GUWAHATI_CENTER
}

const BENGALURU_BOUNDS = {
  north: 13.1989,
  south: 12.7342,
  east: 77.8451,
  west: 77.3347
};

const GUWAHATI_BOUNDS = {
  north: 26.20,
  south: 26.12,
  east: 91.85,
  west: 91.67
};

// Types for regions
export type CityRegion = 'north' | 'south' | 'east' | 'west';

/**
 * Determines which region of city a coordinate falls into
 * @param lat - Latitude of the point
 * @param lng - Longitude of the point
 * @returns The region of city (north, south, east, or west)
 */
export function determineRegion(lat: number, lng: number): CityRegion {
  console.log("Determining Region ", lat, lng);
  const city = process.env.CITY_NAME as keyof typeof CITY_CENTERS;
  const latDiff = lat - CITY_CENTERS[city].lat;
  const lngDiff = lng - CITY_CENTERS[city].lng;

  // Determine if point is more north-south or east-west from center
  if (Math.abs(latDiff) > Math.abs(lngDiff)) {
    // More north-south
    return latDiff > 0 ? 'north' : 'south';
  } else {
    // More east-west
    return lngDiff > 0 ? 'east' : 'west';
  }
}

/**
 * Checks if coordinates are within city limits
 * Using approximate bounding box
 */
export function isWithinBangalore(lat: number, lng: number): boolean {
  const city = process.env.CITY_NAME as keyof typeof CITY_CENTERS;

  const BOUNDS = city === 'BANGALORE' ? BENGALURU_BOUNDS : GUWAHATI_BOUNDS;

  return (
    lat >= BOUNDS.south &&
    lat <= BOUNDS.north &&
    lng >= BOUNDS.west &&
    lng <= BOUNDS.east
  );
}
