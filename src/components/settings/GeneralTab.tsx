
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettings } from '@/contexts/SettingsContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Define the valid types to match SettingsContext
type TemperatureUnit = 'celsius' | 'fahrenheit';
type DistanceUnit = 'metric' | 'imperial';
type TimeFormat = '12h' | '24h';

const GeneralTab: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="space-y-4">
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
              onValueChange={(value: TemperatureUnit) => 
                updateSettings({ temperatureUnit: value })
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
              onValueChange={(value: DistanceUnit) => 
                updateSettings({ distanceUnit: value })
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
              onValueChange={(value: TimeFormat) => 
                updateSettings({ timeFormat: value })
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
    </div>
  );
};

export default GeneralTab;
