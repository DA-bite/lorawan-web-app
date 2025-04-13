import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, MapPin, Power, Calendar } from 'lucide-react';
import { Device, getDeviceMetricsForDate } from '@/services/device';
import DeviceLineChart from '@/components/charts/DeviceLineChart';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface OverviewTabProps {
  device: Device;
  onSendCommand: (command: string, params: any) => Promise<void>;
  isSendingCommand: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  device,
  onSendCommand,
  isSendingCommand
}) => {
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        const data = await getDeviceMetricsForDate(device.id, selectedDate);
        
        if (data.length > 0) {
          setMetrics(data);
        } else if (device.data?.history) {
          setMetrics(device.data.history);
        }
      } catch (error) {
        console.error('Error fetching device metrics:', error);
        if (device.data?.history) {
          setMetrics(device.data.history);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMetrics();
  }, [device, selectedDate]);

  const getDataKeys = () => {
    if (metrics.length === 0) return [];
    
    return Object.keys(metrics[0])
      .filter(key => key !== 'timestamp')
      .filter(key => typeof metrics[0][key] === 'number');
  };

  const getYAxisLabel = () => {
    if (metrics.length === 0) return '';
    
    const keys = Object.keys(metrics[0]).filter(key => key !== 'timestamp');
    if (keys.includes('temperature')) return 'Temperature (°C)';
    if (keys.includes('humidity')) return 'Humidity (%)';
    if (keys.includes('battery')) return 'Battery (%)';
    return '';
  };
  
  const getTooltipFormatter = () => {
    if (metrics.length === 0) {
      return (value: number) => `${value}`;
    }
    
    const keys = Object.keys(metrics[0]).filter(key => key !== 'timestamp');
    if (keys.includes('temperature')) {
      return (value: number) => `${value.toFixed(1)}°C`;
    }
    if (keys.includes('humidity')) {
      return (value: number) => `${value.toFixed(1)}%`;
    }
    if (keys.includes('battery')) {
      return (value: number) => `${value.toFixed(0)}%`;
    }
    return (value: number) => `${value.toFixed(1)}`;
  };

  return (
    <div className="pt-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Device Overview</h3>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Latest Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {device.data && Object.entries(device.data)
                .filter(([key]) => key !== 'history' && typeof device.data[key] !== 'object')
                .map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm text-muted-foreground capitalize">{key}</p>
                    <p className="text-xl font-medium">
                      {typeof value === 'boolean'
                        ? (value ? 'Yes' : 'No')
                        : typeof value === 'number'
                        ? (key.includes('temperature') 
                            ? `${value.toFixed(1)}°C` 
                            : key.includes('humidity') 
                            ? `${value.toFixed(1)}%` 
                            : key.includes('battery')
                            ? `${value.toFixed(0)}%`
                            : value.toFixed(1))
                        : String(value)}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                className="w-full"
                onClick={() => onSendCommand('restart', {})}
                disabled={isSendingCommand || device.status === 'offline'}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Restart Device
              </Button>
              
              {device.type === 'actuator' && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onSendCommand('toggle', { power: !device.data.power })}
                  disabled={isSendingCommand || device.status === 'offline'}
                >
                  <Power className="h-4 w-4 mr-2" />
                  {device.data.power ? 'Turn Off' : 'Turn On'}
                </Button>
              )}
              
              <Button
                variant="link"
                className="w-full"
                asChild
              >
                <Link to={`/map?device=${device.id}`}>
                  <MapPin className="h-4 w-4 mr-2" />
                  View on Map
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {metrics.length > 0 && (
        <div className={isMobile ? "w-full overflow-hidden" : ""}>
          <DeviceLineChart
            title="Historical Data"
            data={metrics}
            dataKeys={getDataKeys()}
            yAxisLabel={getYAxisLabel()}
            tooltipFormatter={getTooltipFormatter()}
            timeFormat="HH:mm"
            dateFilter={selectedDate}
          />
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
