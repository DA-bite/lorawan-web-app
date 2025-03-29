
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

// Get all devices for the current user
export const getDevices = async (): Promise<Device[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      toast.error('You must be logged in to view devices');
      return [];
    }

    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching devices:', error);
      toast.error('Failed to fetch devices');
      throw error;
    }

    // Map the database response to our Device interface
    return data.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      status: item.status,
      battery: item.battery,
      signal: item.signal,
      lastSeen: item.last_seen,
      location: item.location,
      data: item.data
    }));
  } catch (error) {
    console.error('Error fetching devices:', error);
    toast.error('Failed to fetch devices');
    throw error;
  }
};

// Get a single device by ID
export const getDeviceById = async (id: string): Promise<Device> => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching device ${id}:`, error);
      toast.error('Failed to fetch device details');
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      status: data.status,
      battery: data.battery,
      signal: data.signal,
      lastSeen: data.last_seen,
      location: data.location,
      data: data.data
    };
  } catch (error) {
    console.error(`Error fetching device ${id}:`, error);
    toast.error('Failed to fetch device details');
    throw error;
  }
};

// Send command to device
export const sendCommand = async (deviceId: string, command: string, params: any): Promise<boolean> => {
  try {
    // Get the device first to ensure it exists and belongs to the user
    const device = await getDeviceById(deviceId);
    
    // In a real application, this would send the command to the physical device
    // For our demo, we'll just update the device data in the database
    const newData = { ...device.data };
    
    // Apply changes based on the command
    if (command === 'setPower' && params.power !== undefined) {
      newData.power = params.power;
    } else if (command === 'setBrightness' && params.brightness !== undefined) {
      newData.brightness = params.brightness;
    } else if (command === 'setInterval' && params.interval !== undefined) {
      // Just simulate this command
    } else if (command === 'setLowPower') {
      // Just simulate this command
    } else if (command === 'forceUpdate') {
      // Just simulate this command
    } else if (command === 'restart') {
      // Just simulate this command
    }
    
    // Update the device in the database
    const { error } = await supabase
      .from('devices')
      .update({
        data: newData,
        updated_at: new Date().toISOString()
      })
      .eq('id', deviceId);

    if (error) {
      throw error;
    }
    
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
    // Convert our frontend model to the database model
    const dbSettings: any = {};
    
    if (settings.name) dbSettings.name = settings.name;
    if (settings.location) dbSettings.location = settings.location;
    if (settings.data) dbSettings.data = settings.data;
    
    dbSettings.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('devices')
      .update(dbSettings)
      .eq('id', deviceId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast.success('Device settings updated successfully');
    
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      status: data.status,
      battery: data.battery,
      signal: data.signal,
      lastSeen: data.last_seen,
      location: data.location,
      data: data.data
    };
  } catch (error) {
    console.error('Error updating device settings:', error);
    toast.error('Failed to update device settings');
    throw error;
  }
};

// Register a new device
export const registerDevice = async (deviceData: Partial<Device>): Promise<Device> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      toast.error('You must be logged in to register devices');
      throw new Error('Authentication required');
    }

    // Prepare the device data for database
    const newDevice = {
      user_id: session.session.user.id,
      name: deviceData.name || 'New Device',
      type: deviceData.type || 'sensor',
      status: deviceData.status || 'offline',
      battery: deviceData.battery || 100,
      signal: deviceData.signal || 0,
      last_seen: new Date().toISOString(),
      location: deviceData.location || { lat: 43.238949, lng: 76.889709 }, // Default to Almaty
      data: deviceData.data || {}
    };
    
    const { data, error } = await supabase
      .from('devices')
      .insert(newDevice)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast.success('Device registered successfully');
    
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      status: data.status,
      battery: data.battery,
      signal: data.signal,
      lastSeen: data.last_seen,
      location: data.location,
      data: data.data
    };
  } catch (error) {
    console.error('Error registering device:', error);
    toast.error('Failed to register device');
    throw error;
  }
};

// Delete a device
export const deleteDevice = async (deviceId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', deviceId);
    
    if (error) {
      throw error;
    }
    
    toast.success('Device deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting device:', error);
    toast.error('Failed to delete device');
    throw error;
  }
};
