// TODO: Make this dynamic - Bangalore's approximate geographical center
const BANGALORE_CENTER = {
  lat: 12.9716,
  lng: 77.5946
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
  const latDiff = lat - BANGALORE_CENTER.lat;
  const lngDiff = lng - BANGALORE_CENTER.lng;

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
  // TODO: Make this dynamic - Approximate bounding box for Bangalore
  const BANGALORE_BOUNDS = {
    north: 13.1989,
    south: 12.7342,
    east: 77.8451,
    west: 77.3347
  };

  return (
    lat >= BANGALORE_BOUNDS.south &&
    lat <= BANGALORE_BOUNDS.north &&
    lng >= BANGALORE_BOUNDS.west &&
    lng <= BANGALORE_BOUNDS.east
  );
}
