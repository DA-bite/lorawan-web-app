
export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  battery: number;
  signal: number;
  lastSeen: string;
  location: {
    lat: number;
    lng: number;
  };
  data: {
    [key: string]: any;
  };
}

export interface DeviceMetrics {
  timestamp: string;
  temperature?: number;
  humidity?: number;
  battery: number;
  signal: number;
}

export interface DeviceAnalytics {
  date: string;
  averages: {
    temperature?: number;
    humidity?: number;
    battery: number;
    signal: number;
  };
  ranges: {
    temperature?: {
      min: number;
      max: number;
    };
    humidity?: {
      min: number;
      max: number;
    };
    battery: {
      min: number;
      max: number;
    };
    signal: {
      min: number;
      max: number;
    };
  };
  dataPoints: number;
}
