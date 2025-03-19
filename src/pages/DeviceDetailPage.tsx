import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDeviceById, sendCommand } from '@/services/deviceService';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import DeviceLineChart from '@/components/charts/DeviceLineChart';
import {
  ArrowLeft,
  Battery,
  Signal,
  MapPin,
  Clock,
  BarChart,
  Power,
  Settings2,
  RefreshCw,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

const DeviceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isSendingCommand, setIsSendingCommand] = useState(false);
  
  const { data: device, isLoading, error, refetch } = useQuery({
    queryKey: ['device', id],
    queryFn: () => getDeviceById(id!),
    enabled: !!id,
  });
  
  const handleSendCommand = async (command: string, params: any) => {
    if (!device) return;
    
    try {
      setIsSendingCommand(true);
      await sendCommand(device.id, command, params);
      refetch();
    } catch (error) {
      console.error('Failed to send command:', error);
    } finally {
      setIsSendingCommand(false);
    }
  };
  
  const handleDeleteDevice = () => {
    if (isConfirmingDelete) {
      toast.success('Device has been deleted');
      navigate('/devices');
    } else {
      setIsConfirmingDelete(true);
      setTimeout(() => setIsConfirmingDelete(false), 3000);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-40 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-60 bg-muted rounded"></div>
            <div className="h-60 bg-muted rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !device) {
    return (
      <Layout>
        <div className="text-center py-12">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-destructive">Error Loading Device</h2>
          <p className="mt-2 text-muted-foreground">
            We couldn't find the device you're looking for.
          </p>
          <div className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/devices')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Devices
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
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
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/devices')}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{device.name}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDeleteDevice}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {isConfirmingDelete ? 'Confirm' : 'Delete'}
            </Button>
          </div>
        </div>
        
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
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="control">Control</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-4 space-y-4">
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
                      onClick={() => handleSendCommand('restart', {})}
                      disabled={isSendingCommand || device.status === 'offline'}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Restart Device
                    </Button>
                    
                    {device.type === 'actuator' && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSendCommand('toggle', { power: !device.data.power })}
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
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="control" className="pt-4">
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
                            handleSendCommand('setPower', { power: checked })
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
                            handleSendCommand('setBrightness', { brightness: value[0] })
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
                            handleSendCommand('setInterval', { interval: 15 })
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
                            handleSendCommand('setLowPower', { enabled: checked })
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
                        onClick={() => handleSendCommand('forceUpdate', {})}
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
          </TabsContent>
          
          <TabsContent value="settings" className="pt-4">
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
                        onClick={handleDeleteDevice}
                      >
                        {isConfirmingDelete ? 'Confirm Delete' : 'Delete Device'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DeviceDetailPage;
