
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/contexts/SettingsContext';
import { useLanguage } from '@/contexts/LanguageContext';

const NotificationsTab: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
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
                updateSettings({ notificationsEnabled: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">{t('email_notifications')}</Label>
            <Switch 
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => 
                updateSettings({ emailNotifications: checked })
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
                updateSettings({ pushNotifications: checked })
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
                    updateSettings({ criticalAlerts: checked })
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
                    updateSettings({ warningAlerts: checked })
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
                    updateSettings({ statusUpdates: checked })
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
                    updateSettings({ dailyReports: checked })
                  }
                  disabled={!settings.notificationsEnabled}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsTab;
