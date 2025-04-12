
import React from 'react';
import { Settings2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Device } from '@/services/device';
import { useLanguage } from '@/contexts/LanguageContext';

interface SettingsTabProps {
  device: Device;
  isConfirmingDelete: boolean;
  onDeleteDevice: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ 
  device, 
  isConfirmingDelete,
  onDeleteDevice
}) => {
  const { t } = useLanguage();

  return (
    <div className="pt-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings2 className="h-5 w-5 mr-2" />
            {t('device_settings')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('device_name')}</label>
              <div className="flex space-x-2">
                <Input defaultValue={device.name} />
                <Button>{t('save')}</Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('location')}</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t('latitude')}</p>
                  <Input defaultValue={device.location.lat.toString()} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t('longitude')}</p>
                  <Input defaultValue={device.location.lng.toString()} />
                </div>
              </div>
              <Button className="mt-2">{t('update_location')}</Button>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t('alert_thresholds')}</h3>
              <p className="text-xs text-muted-foreground">
                {t('thresholds_description')}
              </p>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-xs">{t('low_battery_warning')}</label>
                  <Input type="number" defaultValue="20" min="0" max="100" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs">{t('low_signal_warning')}</label>
                  <Input type="number" defaultValue="30" min="0" max="100" />
                </div>
                
                {device.type === 'sensor' && device.data.temperature !== undefined && (
                  <div className="space-y-2">
                    <label className="text-xs">{t('high_temperature_alert')}</label>
                    <Input type="number" defaultValue="30" />
                  </div>
                )}
              </div>
              
              <Button className="mt-2">{t('save_thresholds')}</Button>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-medium text-destructive">{t('danger_zone')}</h3>
              <p className="text-xs text-muted-foreground">
                {t('irreversible_actions')}
              </p>
              
              <div className="flex space-x-2 mt-4">
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Factory reset command sent to device')}
                >
                  {t('factory_reset')}
                </Button>
                
                <Button 
                  variant="destructive"
                  onClick={onDeleteDevice}
                >
                  {isConfirmingDelete ? t('confirm_delete') : t('delete_device')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
