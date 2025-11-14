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
  baseCost: number = 20,
  costPerKm: number = 5
): number {
  return Math.ceil(baseCost + (distance * costPerKm));
}

/**
 * Enhanced reverse geocoding function using OpenStreetMap Nominatim API
 * Only makes one request at zoom level 18 for maximum detail
 */
export async function reverseGeocodeWithFallback(latitude: number, longitude: number): Promise<string> {
  try {
    const result = await reverseGeocodeOpenStreetMap(latitude, longitude);
    if (result && result.length > 10) {
      console.log('Successfully geocoded with OpenStreetMap:', result);
      return result;
    }
  } catch (error) {
    console.log('OpenStreetMap geocoding failed:', error);
  }

  // Final fallback to coordinates
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}

/**
 * Optimized reverse geocoding function using OpenStreetMap Nominatim API
 * Only makes one request at zoom level 18 for maximum detail
 */
async function reverseGeocodeOpenStreetMap(latitude: number, longitude: number): Promise<string> {
  try {
    // Use OpenStreetMap Nominatim API with detailed address components
    // Only make one request at zoom level 18 for maximum detail (no multiple zoom levels)
    const zoom = 18;
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=${zoom}&addressdetails=1&extratags=1&namedetails=1`,
      {
        headers: {
          'User-Agent': 'Corpease-Delivery-App/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`OpenStreetMap Response (zoom ${zoom}):`, JSON.stringify(data, null, 2));

    if (data && data.address) {
      const address = data.address;
      
      // Enhanced street name extraction - try multiple field names
      let streetName = '';
      let houseNumber = '';

      // Try different variations of street/road names
      streetName = address.road ||
                  address.pedestrian ||
                  address.street ||
                  address.residential ||
                  address.highway ||
                  address.path ||
                  address.cycleway ||
                  address.footway ||
                  address.name || // Generic name field
                  '';

      // Try different variations of house numbers
      houseNumber = address.house_number ||
                   address.housenumber ||
                   address['addr:housenumber'] || // OSM tag format
                   '';

      // Build address components array
      const components = [];

      // Add house number and street name if available
      if (houseNumber && streetName) {
        components.push(`${houseNumber} ${streetName}`);
      } else if (streetName) {
        components.push(streetName);
      } else if (address.name) {
        components.push(address.name);
      }

      // Add neighborhood/suburb information
      if (address.neighbourhood) {
        components.push(address.neighbourhood);
      } else if (address.suburb) {
        components.push(address.suburb);
      }

      // Add city information
      if (address.city) {
        components.push(address.city);
      } else if (address.town) {
        components.push(address.town);
      }

      // Add state information
      if (address.state) {
        components.push(address.state);
      }

      // Add postal code
      if (address.postcode) {
        components.push(address.postcode);
      }

      // Create the final address string
      if (components.length > 0) {
        const result = components.join(', ');
        // Clean up the address by removing country names
        const cleanResult = result.replace(', India', '').replace(', United States', '');
        console.log('Final formatted address:', cleanResult);
        return cleanResult;
      }
    }

    // Fallback to display_name if no good components found (often more readable)
    if (data.display_name) {
      const cleanDisplayName = data.display_name.replace(', India', '').replace(', United States', '');
      console.log('Using display_name fallback:', cleanDisplayName);
      return cleanDisplayName;
    }

    // Final fallback to coordinates
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
}

/**
 * Validate pincode format (6 digits)
 */
export function isValidPincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode);
}

/**
 * Calculate area of polygon using Shoelace formula
 */
export function calculatePolygonArea(coordinates: Coordinates[]): number {
  if (coordinates.length < 3) return 0;

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

/**
 * Check if delivery is possible to coordinates
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
  // For now, return empty array
  return [];
}