
import { Json } from "@/integrations/supabase/types";

// Helper functions to parse and validate data from the database
export function validateStatus(status: string): 'online' | 'offline' | 'warning' | 'error' {
  const validStatuses = ['online', 'offline', 'warning', 'error'] as const;
  if (validStatuses.includes(status as any)) {
    return status as 'online' | 'offline' | 'warning' | 'error';
  }
  // Default to offline if invalid status
  return 'offline';
}

export function parseLocation(locationData: Json): { lat: number; lng: number } {
  if (typeof locationData === 'object' && locationData !== null) {
    const location = locationData as Record<string, any>;
    // Check if lat and lng are numbers
    if (typeof location.lat === 'number' && typeof location.lng === 'number') {
      return { lat: location.lat, lng: location.lng };
    }
  }
  // Return default location if parsing fails
  console.warn('Invalid location data:', locationData);
  return { lat: 43.238949, lng: 76.889709 }; // Default to Almaty
}

export function parseData(jsonData: Json): { [key: string]: any } {
  if (typeof jsonData === 'object' && jsonData !== null) {
    return jsonData as Record<string, any>;
  }
  // Return empty object if parsing fails
  console.warn('Invalid device data:', jsonData);
  return {};
}
