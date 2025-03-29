
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
