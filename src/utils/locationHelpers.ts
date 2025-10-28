// Location and geography utilities

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  formatted?: string;
}

export interface LocationInfo {
  coordinates: Coordinates;
  address: Address;
  accuracy?: number;
  timestamp: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates,
  unit: 'km' | 'miles' = 'km'
): number {
  const R = unit === 'km' ? 6371 : 3959; // Earth's radius in km or miles

  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) * Math.cos(toRadians(coord2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Check if a point is within a certain radius of another point
 */
export function isWithinRadius(
  center: Coordinates,
  point: Coordinates,
  radius: number,
  unit: 'km' | 'miles' = 'km'
): boolean {
  const distance = calculateDistance(center, point, unit);
  return distance <= radius;
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(
  coordinates: Coordinates,
  precision: number = 6
): string {
  return `${coordinates.latitude.toFixed(precision)}, ${coordinates.longitude.toFixed(precision)}`;
}

/**
 * Parse coordinates from string
 */
export function parseCoordinates(coordString: string): Coordinates | null {
  const match = coordString.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
  if (!match) return null;

  const latitude = parseFloat(match[1]);
  const longitude = parseFloat(match[2]);

  if (isNaN(latitude) || isNaN(longitude)) return null;
  if (latitude < -90 || latitude > 90) return null;
  if (longitude < -180 || longitude > 180) return null;

  return { latitude, longitude };
}

/**
 * Get bounding box for a center point and radius
 */
export function getBoundingBox(
  center: Coordinates,
  radius: number,
  unit: 'km' | 'miles' = 'km'
): {
  northEast: Coordinates;
  southWest: Coordinates;
} {
  const R = unit === 'km' ? 6371 : 3959;
  const latRadian = toRadians(center.latitude);
  const lonRadian = toRadians(center.longitude);

  const angularRadius = radius / R;

  const minLat = latRadian - angularRadius;
  const maxLat = latRadian + angularRadius;
  const minLon = lonRadian - angularRadius;
  const maxLon = lonRadian + angularRadius;

  const northEast = {
    latitude: toDegrees(maxLat),
    longitude: toDegrees(maxLon),
  };

  const southWest = {
    latitude: toDegrees(minLat),
    longitude: toDegrees(minLon),
  };

  return { northEast, southWest };
}

/**
 * Convert degrees to radians
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Check if coordinates are valid
 */
export function isValidCoordinates(coordinates: Coordinates): boolean {
  const { latitude, longitude } = coordinates;

  return (
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180 &&
    !isNaN(latitude) && !isNaN(longitude)
  );
}

/**
 * Format address for display
 */
export function formatAddress(address: Address): string {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.pincode,
    address.country,
  ].filter(Boolean);

  return parts.join(', ');
}

/**
 * Parse address from formatted string
 */
export function parseAddress(formattedAddress: string): Address {
  const parts = formattedAddress.split(',').map(part => part.trim());

  // This is a simplified parser - in reality, you'd use Google Places API
  return {
    street: parts[0] || '',
    city: parts[1] || '',
    state: parts[2] || '',
    pincode: parts[3] || '',
    country: parts[4] || 'India',
    formatted: formattedAddress,
  };
}

/**
 * Validate address
 */
export function isValidAddress(address: Address): boolean {
  return (
    address.street.length >= 3 &&
    address.city.length >= 2 &&
    address.state.length >= 2 &&
    /^\d{6}$/.test(address.pincode) &&
    address.country.length >= 2
  );
}

/**
 * Calculate delivery time based on distance
 */
export function calculateDeliveryTime(
  distance: number,
  averageSpeed: number = 30, // km/h
  baseTime: number = 15 // minutes for preparation
): number {
  const travelTime = (distance / averageSpeed) * 60; // in minutes
  return Math.ceil(baseTime + travelTime);
}

/**
 * Estimate delivery cost based on distance
 */
export function calculateDeliveryCost(
  distance: number,
  baseCost: number = 40,
  perKmCost: number = 10
): number {
  if (distance <= 2) return baseCost; // Free delivery within 2km
  return baseCost + (distance - 2) * perKmCost;
}

/**
 * Get direction between two points
 */
export function getDirection(from: Coordinates, to: Coordinates): string {
  const bearing = calculateBearing(from, to);

  if (bearing >= 337.5 || bearing < 22.5) return 'North';
  if (bearing >= 22.5 && bearing < 67.5) return 'Northeast';
  if (bearing >= 67.5 && bearing < 112.5) return 'East';
  if (bearing >= 112.5 && bearing < 157.5) return 'Southeast';
  if (bearing >= 157.5 && bearing < 202.5) return 'South';
  if (bearing >= 202.5 && bearing < 247.5) return 'Southwest';
  if (bearing >= 247.5 && bearing < 292.5) return 'West';
  return 'Northwest';
}

/**
 * Calculate bearing between two coordinates
 */
function calculateBearing(from: Coordinates, to: Coordinates): number {
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);

  const y = Math.sin(deltaLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

  const bearing = Math.atan2(y, x);
  return (toDegrees(bearing) + 360) % 360;
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Get nearby places categories
 */
export const PLACE_CATEGORIES = {
  restaurant: 'restaurant',
  cafe: 'cafe',
  grocery: 'grocery_or_supermarket',
  pharmacy: 'pharmacy',
  hospital: 'hospital',
  bank: 'bank',
  atm: 'atm',
  gas_station: 'gas_station',
  parking: 'parking',
  shopping_mall: 'shopping_mall',
  store: 'store',
  home_goods_store: 'home_goods_store',
  electronics_store: 'electronics_store',
  clothing_store: 'clothing_store',
  bookstore: 'bookstore',
  jewelry_store: 'jewelry_store',
  department_store: 'department_store',
  convenience_store: 'convenience_store',
} as const;

export type PlaceCategory = keyof typeof PLACE_CATEGORIES;

/**
 * Validate pincode
 */
export function isValidPincode(pincode: string): boolean {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
}

/**
 * Format pincode with space
 */
export function formatPincode(pincode: string): string {
  if (pincode.length !== 6) return pincode;
  return `${pincode.slice(0, 3)} ${pincode.slice(3)}`;
}

/**
 * Get area name from coordinates (reverse geocoding)
 */
export async function reverseGeocode(coordinates: Coordinates): Promise<Address | null> {
  // This would typically use Google Maps Geocoding API
  console.log('Reverse geocoding:', coordinates);

  // For now, return null
  // In a real implementation, this would make an API call
  return null;
}

/**
 * Geocode address to coordinates
 */
export async function geocodeAddress(address: Address): Promise<Coordinates | null> {
  // This would typically use Google Maps Geocoding API
  console.log('Geocoding address:', address);

  // For now, return null
  // In a real implementation, this would make an API call
  return null;
}

/**
 * Get current location (mock implementation)
 */
export async function getCurrentLocation(): Promise<LocationInfo | null> {
  // This would typically use react-native-geolocation-service
  console.log('Getting current location');

  // For now, return null
  // In a real implementation, this would get the actual location
  return null;
}

/**
 * Check if location is within delivery area
 */
export function isWithinDeliveryArea(
  location: Coordinates,
  deliveryAreas: Array<{
    center: Coordinates;
    radius: number;
    enabled: boolean;
  }>
): boolean {
  return deliveryAreas.some(area =>
    area.enabled && isWithinRadius(area.center, location, area.radius)
  );
}

/**
 * Calculate optimal delivery route
 */
export function calculateOptimalRoute(
  start: Coordinates,
  stops: Coordinates[],
  end: Coordinates
): {
  totalDistance: number;
  estimatedTime: number;
  route: Coordinates[];
} {
  // This is a simplified implementation
  // In reality, you'd use Google Maps Directions API or similar

  const allPoints = [start, ...stops, end];
  let totalDistance = 0;

  for (let i = 0; i < allPoints.length - 1; i++) {
    totalDistance += calculateDistance(allPoints[i], allPoints[i + 1]);
  }

  const estimatedTime = calculateDeliveryTime(totalDistance);

  return {
    totalDistance,
    estimatedTime,
    route: allPoints,
  };
}

/**
 * Get address suggestions based on query
 */
export async function getAddressSuggestions(
  query: string,
  currentLocation?: Coordinates
): Promise<Array<{
  description: string;
  placeId: string;
  coordinates: Coordinates;
}>> {
  // This would typically use Google Places Autocomplete API
  console.log('Getting address suggestions:', { query, currentLocation });

  // For now, return empty array
  // In a real implementation, this would make an API call
  return [];
}

/**
 * Format distance for display
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
}

/**
 * Get location accuracy description
 */
export function getLocationAccuracyDescription(accuracy: number): string {
  if (accuracy < 10) return 'Very High';
  if (accuracy < 50) return 'High';
  if (accuracy < 100) return 'Medium';
  if (accuracy < 500) return 'Low';
  return 'Very Low';
}

/**
 * Check if two coordinates are approximately equal
 */
export function areCoordinatesEqual(
  coord1: Coordinates,
  coord2: Coordinates,
  tolerance: number = 0.001
): boolean {
  return Math.abs(coord1.latitude - coord2.latitude) < tolerance &&
    Math.abs(coord1.longitude - coord2.longitude) < tolerance;
}

/**
 * Convert coordinates to GeoJSON format
 */
export function coordinatesToGeoJSON(coordinates: Coordinates): {
  type: 'Point';
  coordinates: [number, number];
} {
  return {
    type: 'Point',
    coordinates: [coordinates.longitude, coordinates.latitude],
  };
}

/**
 * Calculate area of a polygon
 */
export function calculatePolygonArea(coordinates: Coordinates[]): number {
  // Using the shoelace formula
  let area = 0;
  const n = coordinates.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += coordinates[i].longitude * coordinates[j].latitude;
    area -= coordinates[j].longitude * coordinates[i].latitude;
  }

  area = Math.abs(area) / 2;
  return area * 111139; // Convert to square meters (approximate)
}

/**
 * Get timezone offset for coordinates
 */
export function getTimezoneOffset(coordinates: Coordinates): number {
  // This would typically use a timezone API
  // For now, return IST offset (+5.5 hours)
  return 5.5;
}

/**
 * Format location for display
 */
export function formatLocation(location: LocationInfo): string {
  return `${formatAddress(location.address)} (${formatCoordinates(location.coordinates)})`;
}

/**
 * Validate delivery address
 */
export function isValidDeliveryAddress(address: Address): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!address.street || address.street.length < 5) {
    errors.push('Street address must be at least 5 characters');
  }

  if (!address.city || address.city.length < 2) {
    errors.push('City must be at least 2 characters');
  }

  if (!address.state || address.state.length < 2) {
    errors.push('State must be at least 2 characters');
  }

  if (!isValidPincode(address.pincode)) {
    errors.push('Please enter a valid 6-digit pincode');
  }

  if (!address.country || address.country.length < 2) {
    errors.push('Country must be at least 2 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
