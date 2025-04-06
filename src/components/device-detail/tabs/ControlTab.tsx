
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Device } from '@/services/device';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';

interface ControlTabProps {
  device: Device;
  isSendingCommand: boolean;
  onSendCommand: (command: string, params: any) => Promise<void>;
}

const ControlTab: React.FC<ControlTabProps> = ({ 
  device, 
  isSendingCommand, 
  onSendCommand 
}) => {
  return (
    <div className="pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Device Controls</CardTitle>
        </CardHeader>
        <CardContent>
          {device.status === 'offline' ? (
            <div className="text-center py-6">
              <AlertTriangle className="h-8 w-8 text-status-warning mx-auto mb-2" />
              <h3 className="text-lg font-medium">Device is offline</h3>
              <p className="text-muted-foreground mt-1">
                This device is currently offline and cannot receive commands
              </p>
            </div>
          ) : device.type === 'actuator' ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Power</label>
                  <Switch
                    checked={device.data.power}
                    onCheckedChange={(checked) => 
                      onSendCommand('setPower', { power: checked })
                    }
                    disabled={isSendingCommand}
                  />
                </div>
                <Separator />
              </div>
              
              {device.data.brightness !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Brightness</label>
                    <span className="text-sm">{device.data.brightness}%</span>
                  </div>
                  <Slider
                    value={[device.data.brightness]}
                    min={0}
                    max={100}
                    step={1}
                    disabled={!device.data.power || isSendingCommand}
                    onValueChange={(value) =>
                      onSendCommand('setBrightness', { brightness: value[0] })
                    }
                  />
                  <Separator className="mt-6" />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Send Custom Command</label>
                <div className="flex space-x-2">
                  <Input placeholder="Command" disabled={isSendingCommand} />
                  <Button
                    disabled={isSendingCommand}
                    onClick={() => toast.info('Custom command feature coming soon')}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-2">
                <h3 className="font-medium">Sensor Device</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  This is a sensor device and has limited control options
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Update Interval</label>
                <div className="flex space-x-2">
                  <Select defaultValue="15">
                    <SelectTrigger>
                      <SelectValue placeholder="Interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Every 5 minutes</SelectItem>
                      <SelectItem value="15">Every 15 minutes</SelectItem>
                      <SelectItem value="30">Every 30 minutes</SelectItem>
                      <SelectItem value="60">Every hour</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => 
                      onSendCommand('setInterval', { interval: 15 })
                    }
                    disabled={isSendingCommand}
                  >
                    Apply
                  </Button>
                </div>
                <Separator className="mt-6" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Low Power Mode</label>
                  <Switch
                    defaultChecked={false}
                    onCheckedChange={(checked) => 
                      onSendCommand('setLowPower', { enabled: checked })
                    }
                    disabled={isSendingCommand}
                  />
                </div>
                <Separator className="mt-6" />
              </div>
              
              <div className="space-y-2">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => onSendCommand('forceUpdate', {})}
                  disabled={isSendingCommand}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Force Update Now
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlTab;
