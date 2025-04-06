
import React, { useState } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import DeviceLineChart from '@/components/charts/DeviceLineChart';
import { Device } from '@/services/device';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface DeviceChartSectionProps {
  devices: Device[] | undefined;
}

export const DeviceChartSection: React.FC<DeviceChartSectionProps> = ({ devices }) => {
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Generate demo data for single device for selected date
  const singleDeviceData = [];
  if (devices && devices.length > 0) {
    const device = devices[0];
    for (let i = 0; i < 24; i++) {
      const date = new Date(selectedDate);
      date.setHours(i);
      date.setMinutes(0);
      date.setSeconds(0);
      
      singleDeviceData.push({
        timestamp: date.toISOString(),
        temperature: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 20,
        battery: 75 + Math.random() * 25,
        signal: 8 + Math.random() * 2,
      });
    }
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
      <Card className="md:col-span-2">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-lg">Device Data</CardTitle>
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="whitespace-nowrap text-xs">{format(selectedDate, 'MMM dd, yyyy')}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    disabled={(date) => date > new Date()}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <Link to="/analytics">
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  View Analytics
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className={isMobile ? "w-full overflow-hidden" : ""}>
            {singleDeviceData.length > 0 ? (
              <DeviceLineChart
                title="Device Metrics"
                data={singleDeviceData}
                dataKeys={['temperature', 'humidity', 'battery', 'signal']}
                yAxisLabel="Value"
                tooltipFormatter={(value) => `${value.toFixed(1)}`}
                dateFilter={selectedDate}
              />
            ) : (
              <div className="h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground">No device data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Device Map</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative h-[200px] bg-muted rounded-md overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <Link to="/map" className="absolute inset-0 flex items-center justify-center">
                <Button>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  View Map
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
