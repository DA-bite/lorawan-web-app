
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface AppSettings {
  temperatureUnit: 'celsius' | 'fahrenheit';
  distanceUnit: 'metric' | 'imperial';
  timeFormat: '12h' | '24h';
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  criticalAlerts: boolean;
  warningAlerts: boolean;
  statusUpdates: boolean;
  dailyReports: boolean;
}

interface SettingsContextType {
  settings: AppSettings;
  loadingSettings: boolean;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  temperatureUnit: 'celsius',
  distanceUnit: 'metric',
  timeFormat: '24h',
  notificationsEnabled: true,
  emailNotifications: true,
  pushNotifications: true,
  criticalAlerts: true,
  warningAlerts: true,
  statusUpdates: true,
  dailyReports: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Load settings whenever the user changes
  useEffect(() => {
    if (user) {
      loadSettings();
    } else {
      // If not logged in, use local storage for anonymous settings
      const storedSettings = localStorage.getItem('appSettings');
      if (storedSettings) {
        try {
          setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
        } catch (error) {
          console.error('Failed to parse stored settings:', error);
        }
      }
      setLoadingSettings(false);
    }
  }, [user]);

  const loadSettings = async () => {
    setLoadingSettings(true);
    try {
      // Try to get settings from the database
      const { data, error } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw error;
      }

      if (data) {
        setSettings({ ...defaultSettings, ...data.settings });
      } else {
        // If no settings found, create default settings
        await saveSettingsToDatabase(defaultSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load user settings');
    } finally {
      setLoadingSettings(false);
    }
  };

  const saveSettingsToDatabase = async (newSettings: AppSettings) => {
    if (!user) {
      // Save to local storage if not logged in
      localStorage.setItem('appSettings', JSON.stringify(newSettings));
      return;
    }

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          settings: newSettings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save user settings');
      throw error;
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await saveSettingsToDatabase(updatedSettings);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const resetSettings = async () => {
    try {
      setSettings(defaultSettings);
      await saveSettingsToDatabase(defaultSettings);
      toast.success('Settings reset to defaults');
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      loadingSettings, 
      updateSettings, 
      resetSettings 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
