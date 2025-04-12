
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Device } from '@/services/device';
import { DatePickerControl } from './chart/DatePickerControl';
import { AnalyticsButton } from './chart/AnalyticsButton';
import { DeviceChartDisplay } from './chart/DeviceChartDisplay';
import { MapPreview } from './chart/MapPreview';

interface DeviceChartSectionProps {
  devices: Device[] | undefined;
}

export const DeviceChartSection: React.FC<DeviceChartSectionProps> = ({ devices }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
      <Card className="md:col-span-2">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-lg">Device Data</CardTitle>
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <DatePickerControl 
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
              />
              <AnalyticsButton />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DeviceChartDisplay devices={devices} selectedDate={selectedDate} />
        </CardContent>
      </Card>
      
      <MapPreview />
    </div>
  );
};
