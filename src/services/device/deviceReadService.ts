
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Device, DeviceMetrics, DeviceAnalytics } from "./deviceTypes";
import { validateStatus, parseLocation, parseData, formatDeviceMetrics, formatDeviceAnalytics } from "./deviceUtils";

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

// Get device metrics history
export const getDeviceMetrics = async (deviceId: string, limit: number = 100): Promise<DeviceMetrics[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      toast.error('You must be logged in to view device metrics');
      return [];
    }

    const { data, error } = await supabase
      .from('device_metrics')
      .select('*')
      .eq('device_id', deviceId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error(`Error fetching device metrics for ${deviceId}:`, error);
      toast.error('Failed to fetch device metrics');
      throw error;
    }

    return formatDeviceMetrics(data);
  } catch (error) {
    console.error(`Error fetching device metrics for ${deviceId}:`, error);
    toast.error('Failed to fetch device metrics');
    throw error;
  }
};

// Get device metrics for specific date
export const getDeviceMetricsForDate = async (deviceId: string, date: Date): Promise<DeviceMetrics[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      toast.error('You must be logged in to view device metrics');
      return [];
    }

    // Format date to YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('device_metrics')
      .select('*')
      .eq('device_id', deviceId)
      .gte('timestamp', `${formattedDate}T00:00:00Z`)
      .lte('timestamp', `${formattedDate}T23:59:59Z`)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error(`Error fetching device metrics for ${deviceId} on ${formattedDate}:`, error);
      toast.error('Failed to fetch device metrics for selected date');
      throw error;
    }

    return formatDeviceMetrics(data);
  } catch (error) {
    console.error(`Error fetching device metrics:`, error);
    toast.error('Failed to fetch device metrics');
    throw error;
  }
};

// Get device analytics for a date range
export const getDeviceAnalytics = async (deviceId: string, startDate: Date, endDate: Date): Promise<DeviceAnalytics[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      toast.error('You must be logged in to view device analytics');
      return [];
    }

    // Format dates to YYYY-MM-DD
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('device_id', deviceId)
      .gte('date', formattedStartDate)
      .lte('date', formattedEndDate)
      .order('date', { ascending: true });

    if (error) {
      console.error(`Error fetching device analytics for ${deviceId}:`, error);
      toast.error('Failed to fetch device analytics');
      throw error;
    }

    return data.map(formatDeviceAnalytics);
  } catch (error) {
    console.error(`Error fetching device analytics:`, error);
    toast.error('Failed to fetch device analytics');
    throw error;
  }
};
