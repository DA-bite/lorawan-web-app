
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Battery, Signal, MapPin, CheckCircle, Power, AlertTriangle, XCircle } from 'lucide-react';
import { Device } from '@/services/device';
import { formatDistanceToNow } from 'date-fns';

interface DeviceStatusCardProps {
  device: Device;
}

const DeviceStatusCard: React.FC<DeviceStatusCardProps> = ({ device }) => {
  const statusIcon = {
    online: <CheckCircle className="h-5 w-5 text-status-online" />,
    offline: <Power className="h-5 w-5 text-status-offline" />,
    warning: <AlertTriangle className="h-5 w-5 text-status-warning" />,
    error: <XCircle className="h-5 w-5 text-status-error" />
  }[device.status];
  
  const statusText = {
    online: 'Online',
    offline: 'Offline',
    warning: 'Warning',
    error: 'Error'
  }[device.status];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <Badge 
                  className={`mr-2 ${
                    device.type === 'sensor'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-accent/80'
                  }`}
                >
                  {device.type === 'sensor' ? 'Sensor' : 'Actuator'}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`flex items-center ${
                    device.status === 'online'
                      ? 'border-status-online text-status-online'
                      : device.status === 'warning'
                      ? 'border-status-warning text-status-warning'
                      : device.status === 'error'
                      ? 'border-status-error text-status-error'
                      : 'border-status-offline text-status-offline'
                  }`}
                >
                  {statusIcon}
                  <span className="ml-1">{statusText}</span>
                </Badge>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  Last seen {formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Battery 
                className={`h-5 w-5 mr-1 ${
                  device.battery > 50
                    ? 'text-status-online'
                    : device.battery > 20
                    ? 'text-status-warning'
                    : 'text-status-error'
                }`} 
              />
              <span className="font-medium">{device.battery}%</span>
            </div>
            
            <div className="flex items-center">
              <Signal 
                className={`h-5 w-5 mr-1 ${
                  device.signal > 70
                    ? 'text-status-online'
                    : device.signal > 30
                    ? 'text-status-warning'
                    : 'text-status-error'
                }`} 
              />
              <span className="font-medium">{device.signal}%</span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-1 text-primary" />
              <span className="font-medium">
                {device.location.lat.toFixed(4)}, {device.location.lng.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceStatusCard;
