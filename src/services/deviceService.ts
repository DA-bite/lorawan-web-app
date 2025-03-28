
// Mock data and service functions for devices
// In a real application, these would connect to your backend API

import { toast } from "sonner";

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

// Mock devices data with locations around Almaty, Kazakhstan
const mockDevices: Device[] = [
  {
    id: 'd1',
    name: 'Temperature Sensor A1',
    type: 'sensor',
    status: 'online',
    battery: 87,
    signal: 92,
    lastSeen: new Date().toISOString(),
    location: { lat: 43.238949, lng: 76.889709 }, // Almaty center
    data: {
      temperature: 22.5,
      humidity: 45,
      history: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        temperature: 20 + Math.random() * 5,
        humidity: 40 + Math.random() * 20
      }))
    }
  },
  {
    id: 'd2',
    name: 'Motion Detector B2',
    type: 'sensor',
    status: 'warning',
    battery: 32,
    signal: 78,
    lastSeen: new Date(Date.now() - 120000).toISOString(),
    location: { lat: 43.245501, lng: 76.946001 }, // Medeu area
    data: {
      motionDetected: false,
      lastMotion: new Date(Date.now() - 3600000).toISOString(),
      history: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        motionCount: Math.floor(Math.random() * 5)
      }))
    }
  },
  {
    id: 'd3',
    name: 'Smart Light C3',
    type: 'actuator',
    status: 'online',
    battery: 100,
    signal: 96,
    lastSeen: new Date().toISOString(),
    location: { lat: 43.222600, lng: 76.851200 }, // Almaty Arena area
    data: {
      power: true,
      brightness: 80,
      history: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        powerOn: Math.random() > 0.3,
        brightness: Math.floor(70 + Math.random() * 30)
      }))
    }
  },
  {
    id: 'd4',
    name: 'Water Sensor D4',
    type: 'sensor',
    status: 'error',
    battery: 45,
    signal: 23,
    lastSeen: new Date(Date.now() - 86400000).toISOString(),
    location: { lat: 43.257200, lng: 76.945800 }, // Shymbulak area
    data: {
      leakDetected: true,
      waterLevel: 0.5,
      history: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        waterLevel: Math.random() * 0.6
      }))
    }
  },
  {
    id: 'd5',
    name: 'Soil Moisture E5',
    type: 'sensor',
    status: 'offline',
    battery: 0,
    signal: 0,
    lastSeen: new Date(Date.now() - 259200000).toISOString(),
    location: { lat: 43.230100, lng: 76.826500 }, // Botanical Garden area
    data: {
      moisture: 68,
      history: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        moisture: 60 + Math.random() * 30
      }))
    }
  }
];

// Simulate API fetch delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all devices
export const getDevices = async (): Promise<Device[]> => {
  try {
    // Simulate API call
    await delay(800);
    return [...mockDevices];
  } catch (error) {
    console.error('Error fetching devices:', error);
    toast.error('Failed to fetch devices');
    throw error;
  }
};

// Get a single device by ID
export const getDeviceById = async (id: string): Promise<Device> => {
  try {
    await delay(500);
    const device = mockDevices.find(d => d.id === id);
    if (!device) {
      throw new Error('Device not found');
    }
    return { ...device };
  } catch (error) {
    console.error(`Error fetching device ${id}:`, error);
    toast.error('Failed to fetch device details');
    throw error;
  }
};

// Send command to device
export const sendCommand = async (deviceId: string, command: string, params: any): Promise<boolean> => {
  try {
    await delay(1200);
    
    // Log the command (in a real app, this would be sent to the device)
    console.log(`Command sent to device ${deviceId}:`, { command, params });
    
    // Simulate success
    toast.success(`Command ${command} sent successfully to device`);
    return true;
  } catch (error) {
    console.error('Error sending command:', error);
    toast.error('Failed to send command to device');
    throw error;
  }
};

// Update device settings
export const updateDeviceSettings = async (deviceId: string, settings: any): Promise<Device> => {
  try {
    await delay(1000);
    
    // Find and update the device
    const deviceIndex = mockDevices.findIndex(d => d.id === deviceId);
    if (deviceIndex === -1) {
      throw new Error('Device not found');
    }
    
    // Update the mock device (in a real app, this would update the device on the server)
    const updatedDevice = {
      ...mockDevices[deviceIndex],
      ...settings
    };
    
    mockDevices[deviceIndex] = updatedDevice;
    toast.success('Device settings updated successfully');
    
    return { ...updatedDevice };
  } catch (error) {
    console.error('Error updating device settings:', error);
    toast.error('Failed to update device settings');
    throw error;
  }
};

// Register a new device
export const registerDevice = async (deviceData: Partial<Device>): Promise<Device> => {
  try {
    await delay(1500);
    
    // Create a new device
    const newDevice: Device = {
      id: `d${mockDevices.length + 1}`,
      name: deviceData.name || 'New Device',
      type: deviceData.type || 'sensor',
      status: 'offline',
      battery: 100,
      signal: 0,
      lastSeen: new Date().toISOString(),
      location: deviceData.location || { lat: 37.7749, lng: -122.4194 },
      data: deviceData.data || {}
    };
    
    // Add to mock devices
    mockDevices.push(newDevice);
    toast.success('Device registered successfully');
    
    return { ...newDevice };
  } catch (error) {
    console.error('Error registering device:', error);
    toast.error('Failed to register device');
    throw error;
  }
};
