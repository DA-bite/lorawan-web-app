
import React, { useEffect, useState } from 'react';
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
import Layout from '@/components/layout/Layout';
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
    total: devices?.length || 0
  };
  
  // Select the device with the most recent data for the chart
  const deviceWithRecentData = devices?.find(d => 
    d.status === 'online' && 
    d.data && 
    d.data.history && 
    d.data.history.length > 0
  );
  
  // Create chart data
  const chartData = deviceWithRecentData?.data?.history || [];
  const chartDataKeys = deviceWithRecentData?.data?.history && deviceWithRecentData.data.history.length > 0
    ? Object.keys(deviceWithRecentData.data.history[0]).filter(key => key !== 'timestamp')
    : [];
  
  // Handle alert notifications (simulated)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (statusCount.error > 0 || statusCount.warning > 0) {
        toast({
          title: statusCount.error > 0 ? 'Critical Alert' : 'Warning',
          description: `You have ${statusCount.error > 0 ? statusCount.error + ' devices in error state' : statusCount.warning + ' devices with warnings'}`,
          variant: statusCount.error > 0 ? 'destructive' : 'default',
        });
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [statusCount.error, statusCount.warning, toast]);
  
  // Calculate battery and signal averages
  const batteryAvg = devices?.length 
    ? Math.round(devices.reduce((sum, device) => sum + device.battery, 0) / devices.length) 
    : 0;
    
  const signalAvg = devices?.length 
    ? Math.round(devices.reduce((sum, device) => sum + device.signal, 0) / devices.length) 
    : 0;
  
  // Find the most recent alerts (simulated for demo)
  const recentAlerts = devices
    ?.filter(d => d.status === 'warning' || d.status === 'error')
    .slice(0, 3)
    .map(d => ({
      id: d.id,
      device: d.name,
      type: d.status === 'error' ? 'Critical' : 'Warning',
      message: d.status === 'error' 
        ? 'Device reported a critical error' 
        : 'Device reported a warning condition',
      timestamp: d.lastSeen
    }));
  
  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-destructive">Error loading dashboard</h2>
          <p className="mt-2 text-muted-foreground">
            We encountered a problem while loading your dashboard data.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <Link to="/devices/register">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Device
            </Button>
          </Link>
        </div>
        
        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800/30">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <CheckCircle className="h-8 w-8 text-status-online mb-2" />
              <p className="text-2xl font-bold">{statusCount.online}</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Online</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800/30">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-status-warning mb-2" />
              <p className="text-2xl font-bold">{statusCount.warning}</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Warnings</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200 dark:border-rose-800/30">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <XCircle className="h-8 w-8 text-status-error mb-2" />
              <p className="text-2xl font-bold">{statusCount.error}</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Errors</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 border-slate-200 dark:border-slate-800/30">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Activity className="h-8 w-8 text-status-offline mb-2" />
              <p className="text-2xl font-bold">{statusCount.offline}</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Offline</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Devices */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Recent Devices</CardTitle>
              <CardDescription>
                Latest status of your most active devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div 
                      key={i} 
                      className="h-20 bg-muted/30 rounded-md animate-pulse"
                    />
                  ))}
                </div>
              ) : devices && devices.length > 0 ? (
                <div className="space-y-2">
                  {devices.slice(0, 5).map((device) => (
                    <Link 
                      key={device.id}
                      to={`/devices/${device.id}`}
                      className="block"
                    >
                      <div className="flex items-center p-3 rounded-md hover:bg-muted/50 transition-colors">
                        <div className={`h-3 w-3 rounded-full mr-3 bg-status-${device.status}`} />
                        <div className="flex-1">
                          <h4 className="font-medium">{device.name}</h4>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-sm flex items-center">
                            <Battery className="h-4 w-4 mr-1" />
                            <span>{device.battery}%</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No devices available</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* System Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Overview of your IoT network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Battery className="h-5 w-5 mr-2 text-primary" />
                    <span>Average Battery</span>
                  </div>
                  <span className="font-medium">{batteryAvg}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Signal className="h-5 w-5 mr-2 text-primary" />
                    <span>Average Signal</span>
                  </div>
                  <span className="font-medium">{signalAvg}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    <span>Active Locations</span>
                  </div>
                  <span className="font-medium">{devices?.length || 0}</span>
                </div>
                
                <div className="pt-2 border-t">
                  <h4 className="font-medium flex items-center mb-2">
                    <Bell className="h-5 w-5 mr-2 text-primary" />
                    Recent Alerts
                  </h4>
                  
                  {recentAlerts && recentAlerts.length > 0 ? (
                    <div className="space-y-2">
                      {recentAlerts.map((alert, i) => (
                        <div key={i} className="text-sm rounded-md p-2 bg-muted/30">
                          <div className="flex items-center">
                            {alert.type === 'Critical' ? (
                              <XCircle className="h-4 w-4 text-status-error mr-1" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-status-warning mr-1" />
                            )}
                            <span className={`font-medium ${alert.type === 'Critical' ? 'text-status-error' : 'text-status-warning'}`}>
                              {alert.type}
                            </span>
                          </div>
                          <p className="mt-1 text-xs">{alert.device}: {alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent alerts</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Data Visualization */}
        {deviceWithRecentData && chartDataKeys.length > 0 && (
          <div className={isMobile ? "w-full overflow-hidden" : ""}>
            <DeviceLineChart
              title={`Latest Data: ${deviceWithRecentData.name}`}
              data={chartData}
              dataKeys={chartDataKeys}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
