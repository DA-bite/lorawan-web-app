
import React from 'react';
import { Settings2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Device } from '@/services/device';

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
  return (
    <div className="pt-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings2 className="h-5 w-5 mr-2" />
            Device Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Device Name</label>
              <div className="flex space-x-2">
                <Input defaultValue={device.name} />
                <Button>Save</Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Latitude</p>
                  <Input defaultValue={device.location.lat.toString()} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Longitude</p>
                  <Input defaultValue={device.location.lng.toString()} />
                </div>
              </div>
              <Button className="mt-2">Update Location</Button>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Alert Thresholds</h3>
              <p className="text-xs text-muted-foreground">
                Set thresholds for when to receive alerts from this device
              </p>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-xs">Low Battery Warning (%)</label>
                  <Input type="number" defaultValue="20" min="0" max="100" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs">Low Signal Warning (%)</label>
                  <Input type="number" defaultValue="30" min="0" max="100" />
                </div>
                
                {device.type === 'sensor' && device.data.temperature !== undefined && (
                  <div className="space-y-2">
                    <label className="text-xs">High Temperature Alert (°C)</label>
                    <Input type="number" defaultValue="30" />
                  </div>
                )}
              </div>
              
              <Button className="mt-2">Save Thresholds</Button>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-medium text-destructive">Danger Zone</h3>
              <p className="text-xs text-muted-foreground">
                These actions are irreversible
              </p>
              
              <div className="flex space-x-2 mt-4">
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Factory reset command sent to device')}
                >
                  Factory Reset
                </Button>
                
                <Button 
                  variant="destructive"
                  onClick={onDeleteDevice}
                >
                  {isConfirmingDelete ? 'Confirm Delete' : 'Delete Device'}
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
