
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, MapPin, Power } from 'lucide-react';
import { Device } from '@/services/device';
import DeviceLineChart from '@/components/charts/DeviceLineChart';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const getYAxisLabel = () => {
    if (!device.data?.history || device.data.history.length === 0) return '';
    
    const keys = Object.keys(device.data.history[0]).filter(key => key !== 'timestamp');
    if (keys.includes('temperature')) return 'Temperature (°C)';
    if (keys.includes('humidity')) return 'Humidity (%)';
    return '';
  };
  
  const getTooltipFormatter = () => {
    if (!device.data?.history || device.data.history.length === 0) {
      return (value: number) => `${value}`;
    }
    
    const keys = Object.keys(device.data.history[0]).filter(key => key !== 'timestamp');
    if (keys.includes('temperature')) {
      return (value: number) => `${value.toFixed(1)}°C`;
    }
    if (keys.includes('humidity')) {
      return (value: number) => `${value.toFixed(1)}%`;
    }
    return (value: number) => `${value.toFixed(1)}`;
  };

  return (
    <div className="pt-4 space-y-4">
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
                        ? value.toFixed(1)
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
      
      {device.data?.history && device.data.history.length > 0 && (
        <div className={isMobile ? "w-full overflow-hidden" : ""}>
          <DeviceLineChart
            title="Historical Data"
            data={device.data.history}
            dataKeys={Object.keys(device.data.history[0]).filter(key => key !== 'timestamp')}
            yAxisLabel={getYAxisLabel()}
            tooltipFormatter={getTooltipFormatter()}
            timeFormat="HH:mm"
          />
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
