
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Bell, 
  User, 
  Shield, 
  Globe, 
  Monitor, 
  Moon, 
  Sun,
  CheckCircle, 
  Save,
  LogOut
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
  // User settings
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    criticalAlerts: true,
    warningAlerts: true,
    statusUpdates: true,
    dailyReports: false
  });
  
  // Appearance settings
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [distanceUnit, setDistanceUnit] = useState<'metric' | 'imperial'>('metric');
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('24h');
  const [language, setLanguage] = useState<'english' | 'russian'>('english');
  
  // Handle notification toggle
  const toggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Save settings
  const saveSettings = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Settings saved successfully');
      setIsProcessing(false);
    }, 800);
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        </div>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid grid-cols-3 sm:w-[400px]">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          {/* Account Settings */}
          <TabsContent value="account" className="pt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    onClick={saveSettings}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security
                </CardTitle>
                <CardDescription>
                  Manage your account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <div className="flex space-x-2">
                    <Input 
                      type="password" 
                      placeholder="********" 
                      className="flex-1"
                    />
                    <Button variant="outline">Change</Button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="destructive"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Control how and when you receive alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Notification Channels</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-xs text-muted-foreground">
                        Receive alerts via email
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => toggleNotification('emailNotifications')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Push Notifications</label>
                      <p className="text-xs text-muted-foreground">
                        Receive alerts on your device
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={() => toggleNotification('pushNotifications')}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="font-medium">Alert Types</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Critical Alerts</label>
                      <p className="text-xs text-muted-foreground">
                        Device errors and failures
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.criticalAlerts}
                      onCheckedChange={() => toggleNotification('criticalAlerts')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Warning Alerts</label>
                      <p className="text-xs text-muted-foreground">
                        Low battery, weak signal, etc.
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.warningAlerts}
                      onCheckedChange={() => toggleNotification('warningAlerts')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Status Updates</label>
                      <p className="text-xs text-muted-foreground">
                        Device connection status changes
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.statusUpdates}
                      onCheckedChange={() => toggleNotification('statusUpdates')}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="font-medium">Reports</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Daily Report</label>
                      <p className="text-xs text-muted-foreground">
                        Receive daily summary of device status
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.dailyReports}
                      onCheckedChange={() => toggleNotification('dailyReports')}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={saveSettings}>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Appearance Settings */}
          <TabsContent value="appearance" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="h-5 w-5 mr-2" />
                  Display Settings
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Theme</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Dark Mode</label>
                      <p className="text-xs text-muted-foreground">
                        Toggle between light and dark themes
                      </p>
                    </div>
                    <Switch 
                      checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}
                      className="flex items-center"
                    >
                      {theme === 'dark' ? (
                        <Moon className="h-4 w-4 mr-2" />
                      ) : (
                        <Sun className="h-4 w-4 mr-2" />
                      )}
                    </Switch>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="font-medium">Unit Preferences</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Temperature Unit</label>
                    <div className="flex space-x-2">
                      <Button 
                        variant={temperatureUnit === 'celsius' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => setTemperatureUnit('celsius')}
                      >
                        Celsius (°C)
                      </Button>
                      <Button 
                        variant={temperatureUnit === 'fahrenheit' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => setTemperatureUnit('fahrenheit')}
                      >
                        Fahrenheit (°F)
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Distance Unit</label>
                    <div className="flex space-x-2">
                      <Button 
                        variant={distanceUnit === 'metric' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => setDistanceUnit('metric')}
                      >
                        Metric (km)
                      </Button>
                      <Button 
                        variant={distanceUnit === 'imperial' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => setDistanceUnit('imperial')}
                      >
                        Imperial (mi)
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="font-medium">Regional Settings</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <div className="flex space-x-2">
                      <Button 
                        variant={language === 'english' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => setLanguage('english')}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        English
                      </Button>
                      <Button 
                        variant={language === 'russian' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => setLanguage('russian')}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Russian
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Format</label>
                    <div className="flex space-x-2">
                      <Button 
                        variant={timeFormat === '12h' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => setTimeFormat('12h')}
                      >
                        12-hour
                      </Button>
                      <Button 
                        variant={timeFormat === '24h' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => setTimeFormat('24h')}
                      >
                        24-hour
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={saveSettings}>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
