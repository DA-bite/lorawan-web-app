
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DeviceLineChart from '@/components/charts/DeviceLineChart';
import { Device } from '@/services/device';
import { useIsMobile } from '@/hooks/use-mobile';

interface DeviceChartSectionProps {
  devices: Device[] | undefined;
}

export const DeviceChartSection: React.FC<DeviceChartSectionProps> = ({ devices }) => {
  const isMobile = useIsMobile();
  const today = new Date();
  
  // Generate demo data for single device for today
  const singleDeviceData = [];
  if (devices && devices.length > 0) {
    const device = devices[0];
    for (let i = 0; i < 24; i++) {
      const date = new Date(today);
      date.setHours(i);
      date.setMinutes(0);
      date.setSeconds(0);
      
      singleDeviceData.push({
        timestamp: date.toISOString(),
        temperature: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 20,
      });
    }
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Today's Data</CardTitle>
            <Link to="/analytics">
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                View Analytics
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className={isMobile ? "w-full overflow-hidden" : ""}>
            {singleDeviceData.length > 0 && (
              <DeviceLineChart
                title="Temperature & Humidity"
                data={singleDeviceData}
                dataKeys={['temperature', 'humidity']}
                yAxisLabel="Value (°C / %)"
                tooltipFormatter={(value) => `${value.toFixed(1)}`}
                dateFilter={today}
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Device Map</CardTitle>
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
        </CardHeader>
      </Card>
    </div>
  );
};
