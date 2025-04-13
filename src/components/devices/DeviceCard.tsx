import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Battery, Signal, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Device } from '@/services/deviceService';
import { deleteDevice } from '@/services/device/deviceWriteService';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DeviceCardProps {
  device: Device;
  onDeviceDeleted?: () => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onDeviceDeleted }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const statusColors = {
    online: 'bg-status-online',
    offline: 'bg-status-offline',
    warning: 'bg-status-warning',
    error: 'bg-status-error'
  };

  const statusLabel = {
    online: 'Online',
    offline: 'Offline',
    warning: 'Warning',
    error: 'Error'
  };

  const getBatteryColor = (level: number) => {
    if (level > 70) return 'text-status-online';
    if (level > 30) return 'text-status-warning';
    return 'text-status-error';
  };

  const getSignalColor = (level: number) => {
    if (level > 70) return 'text-status-online';
    if (level > 30) return 'text-status-warning';
    return 'text-status-error';
  };

  const lastSeen = formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true });

  const handleDeleteDevice = async () => {
    try {
      await deleteDevice(device.id);
      toast.success(`${device.name} has been deleted successfully`);
      if (onDeviceDeleted) {
        onDeviceDeleted();
      }
    } catch (error) {
      console.error('Failed to delete device:', error);
      toast.error('Failed to delete device');
    } finally {
      setIsConfirmingDelete(false);
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 h-full",
      "hover:shadow-md border border-border",
      "animate-fade-in"
    )}>
      <CardContent className="p-0 relative">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge 
              className={cn(
                "text-xs font-normal",
                device.type === 'sensor' ? 'bg-primary/10 text-primary' : 'bg-accent/80'
              )}
            >
              {device.type === 'sensor' ? 'Sensor' : 'Actuator'}
            </Badge>
            
            <div className="flex items-center">
              <div className={cn(
                "h-2 w-2 rounded-full mr-1.5",
                statusColors[device.status]
              )} />
              <span className="text-xs font-medium">{statusLabel[device.status]}</span>
            </div>
          </div>
          
          <h3 className="font-medium text-lg mb-1 truncate">{device.name}</h3>
          
          <div className="flex items-center text-xs text-muted-foreground mb-4">
            <Clock className="h-3 w-3 mr-1" />
            <span>Last seen {lastSeen}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center text-sm">
              <Battery className={cn("h-4 w-4 mr-1", getBatteryColor(device.battery))} />
              <span>{device.battery}%</span>
            </div>
            <div className="flex items-center text-sm">
              <Signal className={cn("h-4 w-4 mr-1", getSignalColor(device.signal))} />
              <span>{device.signal}%</span>
            </div>
          </div>
          
          {device.type === 'sensor' && device.data && (
            <div className="border-t pt-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <BarChart className="h-4 w-4 mr-1 text-primary" />
                  <span className="font-medium">Latest Data</span>
                </div>
                <Link to={`/devices/${device.id}/analytics`} className="text-primary text-xs hover:underline">
                  View History
                </Link>
              </div>
              
              <div className="mt-2 grid grid-cols-2 gap-2">
                {Object.entries(device.data)
                  .filter(([key]) => key !== 'history' && typeof device.data[key] !== 'object')
                  .slice(0, 4)
                  .map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <div className="text-xs text-muted-foreground capitalize">{key}</div>
                      <div className="font-medium truncate">
                        {typeof value === 'boolean' 
                          ? (value ? 'Yes' : 'No')
                          : (typeof value === 'number' ? value.toFixed(1) : String(value))
                        }
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => setIsConfirmingDelete(true)}
          className="flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        
        <Link to={`/devices/${device.id}`}>
          <Button variant="outline" size="sm" className="text-xs">
            <span>Details</span>
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>

        <AlertDialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the device "{device.name}" and all associated data.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteDevice} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default DeviceCard;
