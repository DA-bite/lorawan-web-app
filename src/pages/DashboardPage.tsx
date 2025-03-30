
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  MapPin, 
  Battery, 
  Signal, 
  Bell, 
  ArrowRight,
  Clock,
  Plus
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDevices, Device } from '@/services/deviceService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import DeviceLineChart from '@/components/charts/DeviceLineChart';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardPage: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Fetch devices
  const { data: devices, isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
  });
  
  // Device status counts
  const statusCount = {
    online: devices?.filter(d => d.status === 'online').length || 0,
    warning: devices?.filter(d => d.status === 'warning').length || 0,
    error: devices?.filter(d => d.status === 'error').length || 0,
    offline: devices?.filter(d => d.status === 'offline').length || 0,
  };
  
  // Device types counts
  const typeCount = {
    sensor: devices?.filter(d => d.type === 'sensor').length || 0,
    actuator: devices?.filter(d => d.type === 'actuator').length || 0,
  };
  
  // Last updated time
  const lastUpdated = new Date();
  
  // Battery level information
  const lowBatteryDevices = devices?.filter(d => d.battery < 20).length || 0;
  
  // Simplified data for battery chart
  const batteryData = devices?.slice(0, 5).map(device => ({
    name: device.name,
    battery: device.battery,
  })) || [];
  
  // Generate demo data for single device over time
  const singleDeviceData = [];
  if (devices && devices.length > 0) {
    const device = devices[0];
    for (let i = 0; i < 24; i++) {
      const date = new Date();
      date.setHours(date.getHours() - i);
      
      singleDeviceData.unshift({
        timestamp: date.toISOString(),
        temperature: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 20,
      });
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-destructive">Failed to load dashboard data</h3>
        <p className="text-muted-foreground mt-2">
          Please try refreshing the page
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              toast({
                title: "Dashboard updated",
                description: "Latest data has been loaded",
              });
            }}
          >
            <span>Refresh</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex flex-col">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 flex-1">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{devices?.length || 0}</div>
              <div className="bg-primary/10 text-primary p-2 rounded-full">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {typeCount.sensor} sensors, {typeCount.actuator} actuators
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium">Device Status</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
                <span className="text-muted-foreground">Online:</span>
                <span className="ml-1 font-medium">{statusCount.online}</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1.5"></div>
                <span className="text-muted-foreground">Warning:</span>
                <span className="ml-1 font-medium">{statusCount.warning}</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></div>
                <span className="text-muted-foreground">Error:</span>
                <span className="ml-1 font-medium">{statusCount.error}</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-gray-300 mr-1.5"></div>
                <span className="text-muted-foreground">Offline:</span>
                <span className="ml-1 font-medium">{statusCount.offline}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium">Battery Status</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{lowBatteryDevices}</div>
              <div className="bg-yellow-500/10 text-yellow-500 p-2 rounded-full">
                <Battery className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Devices with low battery
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{statusCount.warning + statusCount.error}</div>
              <div className="bg-red-500/10 text-red-500 p-2 rounded-full">
                <Bell className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <Link to="/alerts" className="hover:underline">View all alerts</Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Data</CardTitle>
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
                  yAxisLabel=""
                  tooltipFormatter={(value) => `${value.toFixed(1)}`}
                />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Device Map</CardTitle>
            <CardDescription>Device locations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[200px] bg-muted rounded-md overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Link to="/map" className="absolute inset-0 flex items-center justify-center">
                  <Button>
                    <MapPin className="h-4 w-4 mr-2" />
                    View Map
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Devices</CardTitle>
              <Link to="/devices">
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  View All
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {devices && devices.length > 0 ? (
              <div className="space-y-2">
                {devices.slice(0, 5).map(device => (
                  <Link key={device.id} to={`/devices/${device.id}`}>
                    <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 
                          ${device.status === 'online' ? 'bg-green-500' : 
                            device.status === 'warning' ? 'bg-yellow-500' : 
                            device.status === 'error' ? 'bg-red-500' : 
                            'bg-gray-300'}`}
                        ></div>
                        <span className="font-medium">{device.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true })}
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No devices found</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Alerts</CardTitle>
              <Link to="/alerts">
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  View All
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {devices && devices.some(d => d.status === 'warning' || d.status === 'error') ? (
              <div className="space-y-2">
                {devices
                  .filter(d => d.status === 'warning' || d.status === 'error')
                  .slice(0, 5)
                  .map(device => (
                    <Link key={device.id} to={`/devices/${device.id}`}>
                      <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors">
                        <div className="flex items-center">
                          {device.status === 'warning' ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          <div>
                            <span className="font-medium">{device.name}</span>
                            <div className="text-xs text-muted-foreground">
                              {device.status === 'warning' ? 'Warning' : 'Error'}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </Link>
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-muted-foreground">No active alerts</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center md:justify-end">
        <Link to="/devices/register">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Register New Device
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
