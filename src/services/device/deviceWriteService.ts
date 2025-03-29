
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Device } from "./deviceTypes";
import { validateStatus, parseLocation, parseData } from "./deviceUtils";

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
      status: validateStatus(data.status),
      battery: data.battery,
      signal: data.signal,
      lastSeen: data.last_seen,
      location: parseLocation(data.location),
      data: parseData(data.data)
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
      status: validateStatus(data.status),
      battery: data.battery,
      signal: data.signal,
      lastSeen: data.last_seen,
      location: parseLocation(data.location),
      data: parseData(data.data)
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
