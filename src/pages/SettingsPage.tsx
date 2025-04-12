
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
  const { language, setLanguage, t } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleSaveAppSettings = async (newSettings: any) => {
    try {
      await updateSettings(newSettings);
      toast.success(t('settings_updated'));
    } catch (error) {
      toast.error(t('settings_update_failed'));
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success(t('signed_out_successfully'));
    } catch (error) {
      toast.error(t('sign_out_failed'));
    }
  };
  
  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse">{t('loading')}</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight">{t('settings')}</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="general">{t('general')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('notifications_settings')}</TabsTrigger>
          <TabsTrigger value="account">{t('account_settings')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('display_settings')}</CardTitle>
              <CardDescription>
                {t('customize_look_feel')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="temperature-unit">{t('temperature_unit')}</Label>
                <Select 
                  value={settings.temperatureUnit} 
                  onValueChange={(value) => 
                    handleSaveAppSettings({ temperatureUnit: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_unit')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celsius">{t('celsius')}</SelectItem>
                    <SelectItem value="fahrenheit">{t('fahrenheit')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="distance-unit">{t('distance_unit')}</Label>
                <Select 
                  value={settings.distanceUnit} 
                  onValueChange={(value) => 
                    handleSaveAppSettings({ distanceUnit: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_unit')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">{t('metric')}</SelectItem>
                    <SelectItem value="imperial">{t('imperial')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-format">{t('time_format')}</Label>
                <Select 
                  value={settings.timeFormat} 
                  onValueChange={(value) => 
                    handleSaveAppSettings({ timeFormat: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_format')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">{t('12_hour')}</SelectItem>
                    <SelectItem value="24h">{t('24_hour')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">{t('language')}</Label>
                <Select 
                  value={language} 
                  onValueChange={(value: 'english' | 'russian') => setLanguage(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_language')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">{t('english')}</SelectItem>
                    <SelectItem value="russian">{t('russian')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('notification_preferences')}</CardTitle>
              <CardDescription>
                {t('control_alerts')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications-enabled">{t('enable_notifications')}</Label>
                <Switch 
                  id="notifications-enabled"
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => 
                    handleSaveAppSettings({ notificationsEnabled: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">{t('email_notifications')}</Label>
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
                <Label htmlFor="push-notifications">{t('push_notifications')}</Label>
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
                <h3 className="text-sm font-medium mb-3">{t('alert_types')}</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="critical-alerts">{t('critical_alerts')}</Label>
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
                    <Label htmlFor="warning-alerts">{t('warning_alerts')}</Label>
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
                    <Label htmlFor="status-updates">{t('status_updates')}</Label>
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
                    <Label htmlFor="daily-reports">{t('daily_report')}</Label>
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
              <CardTitle>{t('account_settings')}</CardTitle>
              <CardDescription>
                {t('manage_account_security')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>{t('email')}</Label>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
              
              <div className="pt-4 flex flex-col space-y-2">
                <Button variant="outline">{t('change_password')}</Button>
                <Button variant="outline">{t('update_profile')}</Button>
                <Button 
                  variant="destructive" 
                  className="mt-4 flex items-center justify-center"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('sign_out')}
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
          {t('reset_to_defaults')}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
