
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Device } from "./deviceTypes";
import { validateStatus, parseLocation, parseData } from "./deviceUtils";

// Get all devices for the current user
export const getDevices = async (): Promise<Device[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      toast.error('You must be logged in to view devices');
      return [];
    }

    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
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
      // Ensure status is one of the valid values in the union type
      status: validateStatus(item.status),
      battery: item.battery,
      signal: item.signal,
      lastSeen: item.last_seen,
      // Parse the location from JSONB to our location object
      location: parseLocation(item.location),
      // Parse the data from JSONB to our data object
      data: parseData(item.data)
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
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      toast.error('You must be logged in to view device details');
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .eq('user_id', sessionData.session.user.id)
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
      status: validateStatus(data.status),
      battery: data.battery,
      signal: data.signal,
      lastSeen: data.last_seen,
      location: parseLocation(data.location),
      data: parseData(data.data)
    };
  } catch (error) {
    console.error(`Error fetching device ${id}:`, error);
    toast.error('Failed to fetch device details');
    throw error;
  }
};
