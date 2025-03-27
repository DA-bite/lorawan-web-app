
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { language, setLanguage, t } = useLanguage();
  
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
      toast.success(t('settings') + ' ' + t('save') + ' ' + t('success'));
      setIsProcessing(false);
    }, 800);
  };

  // Update language state
  const handleLanguageChange = (newLanguage: 'english' | 'russian') => {
    setLanguage(newLanguage);
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{t('settings')}</h1>
        </div>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid grid-cols-3 sm:w-[400px]">
            <TabsTrigger value="account">{t('account')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('notifications')}</TabsTrigger>
            <TabsTrigger value="appearance">{t('appearance')}</TabsTrigger>
          </TabsList>
          
          {/* Account Settings */}
          <TabsContent value="account" className="pt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  {t('profile_information')}
                </CardTitle>
                <CardDescription>
                  {t('update_account_information')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('name')}</label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('email')}</label>
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
                        {t('saving')}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t('save_changes')}
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
                  {t('security')}
                </CardTitle>
                <CardDescription>
                  {t('manage_account_security')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('password')}</label>
                  <div className="flex space-x-2">
                    <Input 
                      type="password" 
                      placeholder="********" 
                      className="flex-1"
                    />
                    <Button variant="outline">{t('change')}</Button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="destructive"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('sign_out')}
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
                  {t('notification_preferences')}
                </CardTitle>
                <CardDescription>
                  {t('control_alerts')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">{t('notification_channels')}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">{t('email_notifications')}</label>
                      <p className="text-xs text-muted-foreground">
                        {t('receive_alerts_via_email')}
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => toggleNotification('emailNotifications')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">{t('push_notifications')}</label>
                      <p className="text-xs text-muted-foreground">
                        {t('receive_alerts_on_device')}
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
                  <h3 className="font-medium">{t('alert_types')}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">{t('critical_alerts')}</label>
                      <p className="text-xs text-muted-foreground">
                        {t('device_errors_failures')}
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.criticalAlerts}
                      onCheckedChange={() => toggleNotification('criticalAlerts')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">{t('warning_alerts')}</label>
                      <p className="text-xs text-muted-foreground">
                        {t('low_battery_weak_signal')}
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.warningAlerts}
                      onCheckedChange={() => toggleNotification('warningAlerts')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">{t('status_updates')}</label>
                      <p className="text-xs text-muted-foreground">
                        {t('device_connection_status')}
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
                  <h3 className="font-medium">{t('reports')}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">{t('daily_report')}</label>
                      <p className="text-xs text-muted-foreground">
                        {t('daily_summary')}
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.dailyReports}
                      onCheckedChange={() => toggleNotification('dailyReports')}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={saveSettings}>{t('save_preferences')}</Button>
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
                  {t('display_settings')}
                </CardTitle>
                <CardDescription>
                  {t('customize_look_feel')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">{t('theme')}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">{t('dark_mode')}</label>
                      <p className="text-xs text-muted-foreground">
                        {t('toggle_theme')}
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
                  <h3 className="font-medium">{t('unit_preferences')}</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('temperature_unit')}</label>
                    <div className="flex space-x-2">
                      <Button 
                        variant={temperatureUnit === 'celsius' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => setTemperatureUnit('celsius')}
                      >
                        {t('celsius')}
                      </Button>
                      <Button 
                        variant={temperatureUnit === 'fahrenheit' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => setTemperatureUnit('fahrenheit')}
                      >
                        {t('fahrenheit')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('distance_unit')}</label>
                    <div className="flex space-x-2">
                      <Button 
                        variant={distanceUnit === 'metric' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => setDistanceUnit('metric')}
                      >
                        {t('metric')}
                      </Button>
                      <Button 
                        variant={distanceUnit === 'imperial' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => setDistanceUnit('imperial')}
                      >
                        {t('imperial')}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="font-medium">{t('regional_settings')}</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('language')}</label>
                    <div className="flex space-x-2">
                      <Button 
                        variant={language === 'english' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => handleLanguageChange('english')}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        {t('english')}
                      </Button>
                      <Button 
                        variant={language === 'russian' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => handleLanguageChange('russian')}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        {t('russian')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('time_format')}</label>
                    <div className="flex space-x-2">
                      <Button 
                        variant={timeFormat === '12h' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => setTimeFormat('12h')}
                      >
                        {t('12_hour')}
                      </Button>
                      <Button 
                        variant={timeFormat === '24h' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => setTimeFormat('24h')}
                      >
                        {t('24_hour')}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={saveSettings}>{t('save_preferences')}</Button>
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
