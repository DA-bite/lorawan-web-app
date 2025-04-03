import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useSettings } from '@/contexts/SettingsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetSettings, loadingSettings } = useSettings();
  const { language, setLanguage } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleSaveAppSettings = async (newSettings: any) => {
    try {
      await updateSettings(newSettings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };
  
  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse">Loading settings...</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize how information is displayed in the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="temperature-unit">Temperature Unit</Label>
                <Select 
                  value={settings.temperatureUnit} 
                  onValueChange={(value) => 
                    handleSaveAppSettings({ temperatureUnit: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celsius">Celsius (°C)</SelectItem>
                    <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="distance-unit">Distance Unit</Label>
                <Select 
                  value={settings.distanceUnit} 
                  onValueChange={(value) => 
                    handleSaveAppSettings({ distanceUnit: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (m, km)</SelectItem>
                    <SelectItem value="imperial">Imperial (ft, mi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-format">Time Format</Label>
                <Select 
                  value={settings.timeFormat} 
                  onValueChange={(value) => 
                    handleSaveAppSettings({ timeFormat: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={language} 
                  onValueChange={(value: 'english' | 'russian') => setLanguage(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="russian">Russian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications-enabled">Enable Notifications</Label>
                <Switch 
                  id="notifications-enabled"
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => 
                    handleSaveAppSettings({ notificationsEnabled: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch 
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => 
                    handleSaveAppSettings({ emailNotifications: checked })
                  }
                  disabled={!settings.notificationsEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <Switch 
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => 
                    handleSaveAppSettings({ pushNotifications: checked })
                  }
                  disabled={!settings.notificationsEnabled}
                />
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">Alert Types</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="critical-alerts">Critical Alerts</Label>
                    <Switch 
                      id="critical-alerts"
                      checked={settings.criticalAlerts}
                      onCheckedChange={(checked) => 
                        handleSaveAppSettings({ criticalAlerts: checked })
                      }
                      disabled={!settings.notificationsEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="warning-alerts">Warning Alerts</Label>
                    <Switch 
                      id="warning-alerts"
                      checked={settings.warningAlerts}
                      onCheckedChange={(checked) => 
                        handleSaveAppSettings({ warningAlerts: checked })
                      }
                      disabled={!settings.notificationsEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="status-updates">Status Updates</Label>
                    <Switch 
                      id="status-updates"
                      checked={settings.statusUpdates}
                      onCheckedChange={(checked) => 
                        handleSaveAppSettings({ statusUpdates: checked })
                      }
                      disabled={!settings.notificationsEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="daily-reports">Daily Reports</Label>
                    <Switch 
                      id="daily-reports"
                      checked={settings.dailyReports}
                      onCheckedChange={(checked) => 
                        handleSaveAppSettings({ dailyReports: checked })
                      }
                      disabled={!settings.notificationsEnabled}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Email</Label>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
              
              <div className="pt-4 flex flex-col space-y-2">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Update Profile</Button>
                <Button 
                  variant="destructive" 
                  className="mt-4 flex items-center justify-center"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => resetSettings()}
          className="mr-2"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
