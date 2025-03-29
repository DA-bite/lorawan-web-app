
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceById } from "./deviceReadService";

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
