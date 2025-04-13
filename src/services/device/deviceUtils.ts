
import { Json } from "@/integrations/supabase/types";
import { DeviceMetrics, DeviceAnalytics } from "./deviceTypes";

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

// Helper to convert database timestamp to date object
export const parseTimestamp = (timestamp: string): Date => {
  return new Date(timestamp);
};

// Convert device metrics from database to frontend format
export const formatDeviceMetrics = (metrics: any[]): DeviceMetrics[] => {
  return metrics.map(metric => ({
    timestamp: metric.timestamp,
    temperature: metric.temperature,
    humidity: metric.humidity,
    battery: metric.battery,
    signal: metric.signal
  }));
};

// Convert analytics data from database to frontend format
export const formatDeviceAnalytics = (analytics: any): DeviceAnalytics => {
  return {
    date: analytics.date,
    averages: {
      temperature: analytics.avg_temperature,
      humidity: analytics.avg_humidity,
      battery: analytics.avg_battery,
      signal: analytics.avg_signal
    },
    ranges: {
      temperature: {
        min: analytics.min_temperature,
        max: analytics.max_temperature
      },
      humidity: {
        min: analytics.min_humidity,
        max: analytics.max_humidity
      },
      battery: {
        min: analytics.min_battery,
        max: analytics.max_battery
      },
      signal: {
        min: analytics.min_signal,
        max: analytics.max_signal
      }
    },
    dataPoints: analytics.data_points
  };
};
